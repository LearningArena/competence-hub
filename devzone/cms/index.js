/*
index.js

*/



// This returns a GraphQL query string depending on navstate.
function query_generate_get(navstate)
{
	let tablename = Global.api.ARENA_TABLES[navstate.table]?.name;
	let cursor = navstate.cursor;
	let direction = "after";
	
	if (tablename == null)
	{
		console.warn("query_generate_get: No tablename were provided");
		return null;
	}




	//if (navstate.record_status) {args.push(`record_status:${navstate.record_status}`);}

	let q_fields = '';
	let q_edges = '';
	let q_order = [];
	let q_where = [];
	for(let i in navstate.c)
	{
		
		let cname = navstate.c[i];
		//console.log(cname);
		let cnamev = cname.split(';');
		if (typeof cname !== 'string'){continue;}
		let args = navstate.a[cname];
		if(cname[0] == '$')
		{
			if (typeof(Global.dollarfx_graphql1[cnamev[0]]) !== 'function') {continue;}
			if (typeof(Global.dollarfx_graphql2[cnamev[0]]) !== 'function') {continue;}
			let cc1 = Global.dollarfx_graphql1[cnamev[0]](cnamev, args);
			let cc2 = Global.dollarfx_graphql2[cnamev[0]](cnamev, args);
			q_edges += `${cc1}:${cc2} `;
			console.log(q_edges);
			continue;
		}
		q_fields += cname + ' ';
		if (!Array.isArray(args) || args.length <= 0){continue;}
		if (args[0] != null){q_order.push(`${cname}:${args[0]}`);}
		let q = get_filter_from_cname(args[1], cname);
		if (q)
		{
			q_where.push(q);
		}
	}

	if (q_fields.length == 0)
	{
		console.warn("query_generate_get: No fields were provided");
		return null;
	}

	let qargs = [];
	if (navstate.count > 0)
	{
		qargs.push(`first:${navstate.count}`);
		direction = "after";
	}
	else if (navstate.count < 0)
	{
		qargs.push(`last:${-navstate.count}`);
		direction = "before";
	}
	if (cursor)
	{
		qargs.push(`${direction}:"${cursor}"`);
	}
	if(q_where.length>0){qargs.push("where:{and:["+q_where.join(",")+"]}");}
	if(q_order.length>0){qargs.push("order:{" + q_order.join(",") + "}");}
	//let q_pair = pair ? `has_edge(t:${pair.t2},id:${pair.id2},relation:${pair.relation})` : '';
	//let t_user_edges = `${Global.api.ARENA_LOOKUP_TABLE_SINGULAR[navstate.table]}_user_edges`;
	//let q_user_edges = `USERS:${t_user_edges}{relationship node:user{id email record_status}}`;
	let q = '';
	q += `${tablename}(${qargs.join(',')})`;
	q += `{totalCount pageInfo{hasNextPage hasPreviousPage startCursor endCursor} edges{cursor} nodes{${q_fields} ${q_edges}}}`;
	//console.log(q);
	return q;
}


function html_option(cname)
{
	let select = document.createElement("select");
	let o = Global.api.ARENA_ENUM[cname];
	//let p = Global.api.ARENA_ENUM_PREFIX[cname];
	let option = document.createElement("option");
	select.appendChild(option);
	for(let i in o)
	{
		option = document.createElement("option");
		option.setAttribute("ienum", o[i].ienum);
		option.value = i;
		option.innerText = o[i].prefix + i;
		select.appendChild(option);
	}
	return select;
}


function html_tbody_td_option(tr, navstate, data, r, cnamev, args, html_selections)
{
	console.assert(tr instanceof HTMLTableRowElement);
	console.assert(Array.isArray(cnamev));
	let td = document.createElement("td");
	let value = data.nodes[r]?.[cnamev[0]];
	let ids = [data.nodes[r].id];
	let select = html_option(cnamev[0]);
	select.value = value;
	select.onchange = (e) =>
	{
		let o = Global.api.ARENA_ENUM[cnamev[0]];
		console.log(e.target.value);
		let record_status_int = o[e.target.value].ienum;
		let data = 
		{
			record_status:record_status_int
		};


		{
			//TODO: Don't duplicate this code:
			for(i in html_selections)
			{
				if (html_selections[i].checked)
				{
					let id = html_selections[i].row_id;
					ids.push(id);
				}
			}
		}

		Backend.update(navstate.table, ids, data).then(x=>{
			console.log("Backend.update", x);
			hashchange();
		});
	}
	td.appendChild(select);
	return td;
}


function html_tbody_td_edgebox(tr, navstate, data, r, cnamev, args)
{
	console.assert(tr instanceof HTMLTableRowElement);
	console.assert(Array.isArray(cnamev));
	console.assert(cnamev.length > 0);
	let td = document.createElement("td");
	let component = Global.dollarfx_graphql1["$ebox"](cnamev);
	//console.log(data.nodes[r], component);
	let value = data.nodes[r]?.[component];
	let id1 = data.nodes[r]?.id;
	let t2 = cnamev[1];
	let i2 = parseInt(cnamev[2]);
	let relation = cnamev[3];
	let checkbox = document.createElement("input");
	checkbox.type = 'checkbox';
	checkbox.checked = value;
	checkbox.onchange = (x) =>
	{
		checkbox.disabled = true;
		Backend.pair(navstate.table, id1, relation, t2, i2, x.target.checked).then(y =>
		{
			if(y == 1)
			{
				checkbox.disabled = false;
			}
		});
	}
	td.appendChild(checkbox);
	return td;
}


function html_tbody_td_cursor(tr, navstate, data, r, cnamev, args)
{
	console.assert(tr instanceof HTMLTableRowElement);
	console.assert(Array.isArray(cnamev));
	console.assert(cnamev.length > 0);
	let td = document.createElement("td");
	let a = document.createElement("a");
	let cursor = data.edges[r]?.cursor;
	let navstate_cursor = navstate.cursor;
	navstate.cursor = cursor;
	a.innerText = cursor;
	a.href = Navstate.stringify(navstate);
	navstate.cursor = navstate_cursor;
	td.appendChild(a);
	return td;
}


function html_tbody_td_external_fetch_btn(tr, navstate, data, r, cnamev, args)
{
	console.assert(tr instanceof HTMLTableRowElement);
	console.assert(Array.isArray(cnamev));
	console.assert(cnamev.length > 0);
	let td = document.createElement("td");
	let button = document.createElement("button");
	button.innerText = "Fetch";
	button.onclick = () => {alert("Fetch!");}
	td.appendChild(button);
	return td;
}


function html_tbody_td_selection(tr, navstate, data, r, cnamev, args, html_selections)
{
	console.assert(tr instanceof HTMLTableRowElement);
	console.assert(Array.isArray(cnamev));
	console.assert(Array.isArray(html_selections));
	console.assert(cnamev.length > 0);
	let id = data.nodes[r]?.id;
	let td = document.createElement("td");
	let checkbox = document.createElement("input");
	checkbox.row_id = id;
	html_selections.push(checkbox);
	checkbox.onchange = (x) =>
	{
		console.log(`Table row ${r} select ${x.target.checked}`);
		tr.classList.add("selected");
	}
	checkbox.type = "checkbox";
	td.appendChild(checkbox);
	return td;
}


function html_tbody_td_relations(tr, navstate, data, r, cnamev, args)
{
	console.assert(tr instanceof HTMLTableRowElement);
	console.assert(Array.isArray(cnamev));
	console.assert(cnamev.length > 0);
	let td = document.createElement("td");
	let a0 = document.createElement("a");
	let a1 = document.createElement("a");
	let a2 = document.createElement("a");
	a0.innerText = "AUTHOR";
	a1.innerText = "MEMBER";
	a2.innerText = "FAVORITE";

	let ns = 
	{
		table : cnamev[1],
		c : [],
		a : {},
	};
	let c = Global.api.collections1[ns.table];
	let i;
	for(i = 0; i < c.length; ++i)
	{
		ns.c.push(c[i]);
		ns.a[c[i]] = [null,null,'raw'];
	}
	ns.c.push([]);
	ns.c[i] = `$ebox;${navstate.table};${data.nodes[r].id};${a0.innerText}`;
	a0.href = Navstate.stringify(ns);
	ns.c[i] = `$ebox;${navstate.table};${data.nodes[r].id};${a1.innerText}`;
	a1.href = Navstate.stringify(ns);
	ns.c[i] = `$ebox;${navstate.table};${data.nodes[r].id};${a2.innerText}`;
	a2.href = Navstate.stringify(ns);
	//console.log(ns.c);

	td.appendChild(a0);
	td.appendChild(a1);
	td.appendChild(a2);
	return td;
}


/**
 * Generates HTML GUI for input of table cells.
 * Returns HTML node that should be put inside (table > tbody > tr > td)
 * @param {string} tr       - HTML table row element <tr>
 * @param {object} navstate - Navigation state
 * @param {object} data     - Table data
 * @param {number} r        - Current row number
 * @param {array} cnamev    - Extended column name
 * @param {array} args      - Arguments???
 */
function html_tbody_td_input(tr, navstate, data, r, cnamev, args, html_selections)
{
	// Precondition:
	console.assert(tr instanceof HTMLTableRowElement);
	console.assert(Array.isArray(cnamev));
	console.assert(cnamev.length > 0);

	let value = data.nodes[r]?.[cnamev[0]];
	let ids = [data.nodes[r].id];
	let td = document.createElement("td");
	let a = document.createElement("button");
	let text = document.createElement("span");
	let backend_data = {};
	a.innerText = "✏️";
	a.onclick = (x) => 
	{
		console.log("Global.selection", Global.selection);
		// TODO: Is this code sane?
		switch(x.target.innerText)
		{
		case "✏️":
			Global.element_table.classList.add("onerow");
			tr.style.display = "table-row";
			x.target.innerText = "💾";
			x.target.v = document.createElement("textarea");
			x.target.v.type = "text";
			x.target.v.value = value;
			td.appendChild(x.target.v);
			break;
		case "💾":
			{
				//TODO: Don't duplicate this code:
				for(i in html_selections)
				{
					if (html_selections[i].checked)
					{
						let id = html_selections[i].row_id;
						ids.push(id);
					}
				}
			}
			Global.element_table.classList.remove("onerow");
			tr.style.display = "";
			x.target.innerText = "📡";
			x.target.disabled = true;
			td.removeChild(x.target.v);
			backend_data[cnamev[0]] = parse_by_cname(x.target.v.value, cnamev[0]);
			Backend.update(navstate.table, ids, backend_data).then(result =>
			{
				if (result > 0)
				{
					x.target.innerText = "✏️";
					x.target.disabled = false;
					hashchange();
				}
			});
			break;
		}
	};
	text.innerText = value;
	td.appendChild(a);
	td.appendChild(text);
	return td;
}


function html_tbody_td_raw(tr, navstate, data, r, cnamev, args)
{
	console.assert(tr instanceof HTMLTableRowElement);
	console.assert(Array.isArray(cnamev));
	console.assert(cnamev.length > 0);
	let value = data.nodes[r]?.[cnamev[0]];
	let td = document.createElement("td");
	td.innerText = value;
	return td;
}

// This returns a HTML <tbody>.
function html_tbody_from_rows(data, navstate, html_selections)
{
	console.assert(data);
	console.assert(navstate);
	let tbody = document.createElement("tbody");
	for (let r in data.nodes)
	{
		let tr = document.createElement("tr");
		for (let i in navstate.c)
		{
			let cname = navstate.c[i];
			let cnamev = cname.split(';');
			let args = navstate.a[cname] ?? [];
			let td = null;


			if (td == null)
			{
				switch(cnamev[0])
				{
				case "$selection":          td = html_tbody_td_selection(tr, navstate, data, r, cnamev, args, html_selections);break;
				case "$r":                  td = html_tbody_td_relations(tr, navstate, data, r, cnamev, args);break;
				case "$ebox":               td = html_tbody_td_edgebox(tr, navstate, data, r, cnamev, args);break;
				case "$cursor":             td = html_tbody_td_cursor(tr, navstate, data, r, cnamev, args);break;
				case "$external_fetch_btn": td = html_tbody_td_external_fetch_btn(tr, navstate, data, r, cnamev, args);break;
				}
			}

			if (td == null)
			{
				let gui = args[2] ?? Global.api.components_style[cname]?.edit;
				switch(gui)
				{
				case "input":               td = html_tbody_td_input(tr, navstate, data, r, cnamev, args, html_selections);break;
				case "raw":                 td = html_tbody_td_raw(tr, navstate, data, r, cnamev, args);break;
				case "option":              td = html_tbody_td_option(tr, navstate, data, r, cnamev, args, html_selections);break;
				}
			}

			if (td == null)
			{
				td = document.createElement("td");
			}

			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
	return tbody;
}







// This returns a HTML <tr>.
function html_thead_tr_name(navstate)
{
	//console.log("html_thead_tr_name", navstate);
	let tr = document.createElement("tr");
	for (let i in navstate.c)
	{
		let cname = navstate.c[i];
		let th = document.createElement("th");
		tr.appendChild(th);
		th.draggable = true;
		th.ondragend = (e) =>
		{
			//if (e.target.draggable != true) {return;}
			e.target.classList.remove("drag");
			e.target.classList.remove("dragenter");
		}
		th.ondrop = (e) =>
		{
			//if (e.target.draggable != true) {return;}
			//console.log(e.target, Global.dragging);
			//swap_ab(navstate.c, e.target.getAttribute("cname"), Global.dragging.getAttribute("cname"));
			//console.log(navstate.c, e.target.getAttribute("cname"), Global.dragging.getAttribute("cname"));
			swap_ab(navstate.c, e.target.getAttribute("cname"), Global.dragging.getAttribute("cname"));
			//console.log(navstate.c, e.target.getAttribute("cname"), Global.dragging.getAttribute("cname"));
			Navstate.set(navstate);
		}
		th.ondragenter = (e) =>
		{
			//if (e.target.draggable != true) {return;}
			e.target.classList.add("dragenter");
		}
		th.ondragleave = (e) =>
		{
			//if (e.target.draggable != true) {return;}
			e.target.classList.remove("dragenter");
		}
		th.ondragover = (e) =>
		{
			//if (e.target.draggable != true) {return;}
			e.preventDefault();
		}
		th.ondragstart = (e) =>
		{
			//if (e.target.draggable != true) {return;}
			Global.dragging = e.target;
			e.target.classList.add("drag");
		}
		let prefix = Global.api.components_style[cname]?.prefix;
		let name = Global.api.components_style[cname]?.name;
		th.innerText = (prefix ?? "") + (name ?? cname);
		th.setAttribute("cname", cname);
		if (Global.api.components_style[cname]?.width)
		{
			th.style.width = Global.api.components_style[cname].width;
		}
	}
	return tr;
}


// This returns a HTML <tr>.
function html_thead_tr_args(navstate)
{
	let tr = document.createElement("tr");
	for (let i in navstate.c)
	{
		let args = navstate.c[i];
		let th = document.createElement("th");
		th.classList.add("args");
		tr.appendChild(th);
		th.innerText = args.slice(1).join(",");
	}
	return tr;
}


// This returns a HTML <th>.
// It contains <a> hyperlinks to change orderby navstate.
function html_thead_th_orderby(navstate, i)
{
	let cname = navstate.c[i];
	let th = document.createElement("th");
	let ns = clonedata(navstate);
	ns.a[cname] ??= [];
	let args = ns.a[cname];
	let a0 = document.createElement("a");
	let a1 = document.createElement("a");
	let a2 = document.createElement("a");
	//console.log(navstate.c);
	if (args[0] == "ASC"){a0.classList.add("selected");}
	if (args[0] == "DESC"){a2.classList.add("selected");}
	if (args[0] == null){a1.classList.add("selected");}
	a0.innerText = "ASC";
	a1.innerText = "None";
	a2.innerText = "DESC";
	args[0] = "ASC";
	a0.href = Navstate.stringify(ns);
	args[0] = "DESC";
	a2.href = Navstate.stringify(ns);
	args[0] = null;
	a1.href = Navstate.stringify(ns);
	th.appendChild(a0);
	th.appendChild(a1);
	th.appendChild(a2);
	return th;
}


function html_th_selection(html_selections)
{
	let th = document.createElement("th");
	let checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.onchange = (x) =>
	{
		console.log("html_selections", x.target.checked, html_selections);
		for(id in html_selections)
		{
			html_selections[id].checked = x.target.checked;
		}
	}
	th.appendChild(checkbox);
	return th;
}



/**
 * Returns <th> HTML node that should be put inside (table > thead > tr)
 * It contains <a> hyperlinks to change orderby navstate.
 * @param {object} navstate       - Navigation state
 * @param {array} html_selections - Stores HTML <input>
 * @return {HTMLTableCellElement}
 */
function html_thead_tr1(navstate, html_selections)
{
	let tr = document.createElement("tr");
	for (let i in navstate.c)
	{
		let th = null;
		let cname = navstate.c[i];

		if (isalpha(cname?.[0]))
		{
			// Create orderby GUI to sort rows:
			th = html_thead_th_orderby(navstate, i);
		}

		if(th == null)
		{
			switch(cname)
			{
			case "$selection":
				// Create selection GUI to select rows:
				th = html_th_selection(html_selections);
				break;
			}
		}

		if(th == null)
		{
			// If no GUI were found then create default empty <th>
			th = document.createElement("th");
		}

		tr.appendChild(th);
	}
	return tr;
}


// This returns a HTML <tr>.
// It contains HTML <input> which can change the URL navstate by pressing enter.
function html_thead_tr_filter(navstate)
{
	let tr = document.createElement("tr");
	for (let i in navstate.c)
	{
		let cname = navstate.c[i];
		let args = navstate.a[cname];
		let th = document.createElement("th");
		tr.appendChild(th);
		if (typeof cname !== 'string'){continue;}
		if (cname == '$help'){th.innerText = "Filter";continue;}
		if (cname[0] == '$'){continue;}

		let element = null;
		switch(Global.api.components_style[cname]?.filter)
		{
		case 'input':
			element = document.createElement("input");
			element.type = Global.api.components_style[cname]?.htmltype ?? "";
			element.onkeyup = (e) =>
			{
				if (e.key == "Enter")
				{
					args[0] ??= null;
					args[1] = e.target.value;
					console.log(args);
					navstate.cursor = null;
					Navstate.set(navstate);
				}
			}
			break;
		case 'option':
			element = html_option(cname);
			element.onchange = (e) =>
			{
				args[0] ??= null;
				args[1] = e.target.value;
				navstate.cursor = null;
				Navstate.set(navstate);
			}
			break;
		}

		switch(Global.api.components_style[cname]?.filter)
		{
		case 'input':
		case 'option':
			//console.log(args[1]);
			element.value = args[1] ?? "";
			break;
		}

		if (element instanceof HTMLElement)
		{
			th.appendChild(element);
		}

	}
	return tr;
}

// This returns a HTML <thead> element.
function html_thead(navstate, html_selections)
{
	let thead = document.createElement("thead");
	let tr_name = html_thead_tr_name(navstate);
	//let tr_args = html_thead_tr_args(navstate);
	let tr_filter = html_thead_tr_filter(navstate);
	let tr_orderby = html_thead_tr1(navstate, html_selections);
	thead.appendChild(tr_name);
	//thead.appendChild(tr_args);
	thead.appendChild(tr_orderby);
	thead.appendChild(tr_filter);
	return thead;
}







function html_tnav_update()
{
	//console.log("html_tnav_update");
	let table = Global.element_collections.value;
	for (let cname in Global.cdict)
	{
		//console.log(i, Global.cdict);
		let label = Global.cdict[cname].label;
		let input = label.children[0];
		input.disabled = !Global.api.collections[table].includes(input.value);
		if(input.disabled)
		{
			label.classList.add("disabled");
			label.classList.remove("enabled");
		}
		else
		{
			label.classList.add("enabled");
			label.classList.remove("disabled");
		}
	}
	//console.log(Global);
	if (Global.navstate?.table != table)
	{
		let ns = 
		{
			table: table,
			c: [],
		};
		let c = Global.api.collections1[ns.table];
		for(let i = 0; i < c.length; ++i)
		{
			ns.c.push(c[i]);
		}
		Navstate.set(ns);
	}

}





function html_colnav(target, dict, components)
{
	for (let name in components)
	{
		let label = document.createElement("label");
		let checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.value = name;
		//console.log(dict[name]);
		label.appendChild(checkbox);
		label.innerHTML += name;
		target.appendChild(label);
		dict[name].label = label;
	}
}


function html_tnav(target, collections)
{
	for (let name in collections)
	{
		let o = document.createElement("option");
		o.innerText = name;
		o.value = name;
		target.appendChild(o);
	}
	target.onchange = html_tnav_update;
	//target.value = navstate.table;
	//console.log(target, target.value, navstate.table);
}















function paging(navstate, pageInfo, htmlnodes)
{
	let backup = 
	{
		count: navstate.count,
		cursor: navstate.cursor,
	};
	let count = Math.abs(navstate.count);
	count = (count == 0) ? 10 : count;
	if (pageInfo.hasPreviousPage)
	{
		htmlnodes[0].innerText = '❮';
		navstate.count = -count;
		navstate.cursor = pageInfo.startCursor;
		htmlnodes[0].href = Navstate.stringify(navstate);
	}
	else
	{
		htmlnodes[0].innerText = '🗆';
		htmlnodes[0].removeAttribute('href');
	}
	if (pageInfo.hasNextPage)
	{
		htmlnodes[2].innerText = '❯';
		navstate.count = count;
		navstate.cursor = pageInfo.endCursor;
		htmlnodes[2].href = Navstate.stringify(navstate);
	}
	else
	{
		htmlnodes[2].innerText = '🗆';
		htmlnodes[2].removeAttribute('href');
	}
	{
		navstate.count = count;
		navstate.cursor = "";
		htmlnodes[1].href = Navstate.stringify(navstate);
	}
	navstate.count = backup.count;
	navstate.cursor = backup.cursor;
}





function hashchange(event)
{
	Global.element_table.innerHTML = "";
	Global.element_table.classList.remove("onerow");

	// Update global navstate from URL hash
	Global.navstate = Navstate.get();
	//console.log("hashchange: ", Global.navstate);

	if(Global.navstate == null){console.warn("missing navstate");return;}
	if(Global.navstate.table == null){console.warn("missing table");return;}
	if(Global.navstate.table == null){console.warn("missing table");return;}
	if(Global.navstate.table == null){console.warn("missing table");return;}

	
	Global.element_collections.value = Global.navstate.table;
	Global.element_collections.onchange();
	

	for(let cname in Global.cdict)
	{
		let control = Global.cdict[cname].label.control;
		control.checked = false;
		control.onchange = (e) =>
		{
			let cname = e.target.value;
			if (e.target.checked)
			{
				Global.navstate.c.push(cname);
			}
			else
			{
				for(let i = 0; i < Global.navstate.c.length; ++i)
				{
					if (Global.navstate.c[i] == cname)
					{
						console.log(Global.navstate.c, i);
						Global.navstate.c.splice(i, 1);
						console.log(Global.navstate.c);
					}

				}
			}
			Navstate.set(Global.navstate);
		}
	}

	for(let i in Global.navstate.c)
	{
		let cname = Global.navstate.c[i];
		let c = Global.cdict[cname];
		if (c == null){continue;}
		let control = c.label.control;
		control.checked = true;
	}

	
	
	//console.log(Global.cdict);
	
	{
		let ns = 
		{
			table : Global.navstate.table,
			c : []
		};
		let c = Global.api.collections1[ns.table];
		for(let i = 0; i < c.length; ++i)
		{
			ns.c.push(c[i]);
		}
		Global.element_home.href = Navstate.stringify(ns);
	}


	Global.active_query = query_generate_get(Global.navstate);
	if (Global.active_query == null)
	{
		console.warn("hashchange: Could not generate GraphQL query");
		return;
	}

	

	let html_selections = [];
	let thead = html_thead(Global.navstate, html_selections);
	Global.element_table.appendChild(thead);


	Backend.qfetch(`query{rows:${Global.active_query}}`).then(x => {
		// Preconditions, if-guards:
		if(x.errors){console.error("GraphQL Request Error", x.errors);return;}
		if(x.data.rows == null){console.error("GraphQL Request Error");return;}

		// Success:
		Global.pageInfo = x.data.rows.pageInfo;
		Global.totalCount = x.data.rows.totalCount;
		//console.log('pageInfo:', Global.pageInfo);
		//console.log('totalCount:', Global.totalCount);
		Global.element_middle.innerText = `n=${Global.totalCount}`;
		let tbody = html_tbody_from_rows(x.data.rows, Global.navstate, html_selections);
		Global.element_table.appendChild(tbody);
		paging(Global.navstate, Global.pageInfo, [Global.element_left, Global.element_middle, Global.element_right]);
	});

}






Promise.all([Global.promise_api]).then((values) =>
{
	Global.cdict = {};
	Global.api = values[0];
	for (let name in Global.api.components)
	{
		Global.cdict[name] = {};
	}

	html_tnav(Global.element_collections, Global.api.collections);
	html_colnav(Global.element_components, Global.cdict, Global.api.components);

	hashchange(null);
	window.addEventListener('hashchange', hashchange, false);
	html_tnav_update();
});





function myprint(e)
{
	let content = Global.element_table.innerHTML;
	content = `<!DOCTYPE html><html><head><title>${document.title}</title>
	<link rel="stylesheet" type="text/css" href="index.css"/>
	</head><body>
	<table>${content}</table>
	</body></html>
	`;
	//console.log(content);
	let w = window.open();
	w.document.write(content);
	w.print();
	w.close();
}