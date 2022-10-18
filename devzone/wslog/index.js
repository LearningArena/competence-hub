function indexOf(str, needles, fromIndex)
{
	for (let i = 0; i < needles.length; i++)
	{
		let r = str.indexOf(needles[i], fromIndex);
		if(r >= 0)
		{
			return r;
		}
	}
	return -1;
}

const COLINDEX = 
{
	DATETIME: 0,
	DATETIME_STR: 1,
	CLIENT_IP: 2,
	REQUEST_ID: 3,
	METHOD: 4,
	SOURCE_CONTEXT: 5,
	MESSAGE: 6,
	LEVEL: 7,
}


function getcolor(s)
{
	switch(s)
	{
	case 'Error':return "#FAA";
	case 'Warning':return "#FF7";
	case 'Verbose':return "#defff8";
	case 'Debug':return "#f4edff";
	default:return "#EEE";
	}
}


function getlevel(s)
{
	switch(s)
	{
	case 'Error':return "❌";
	case 'Warning':return "⚠️";
	case 'Verbose':return "👀";
	case 'Debug':return "🕵️‍♂️";
	default:return "ℹ️";
	}
}

function app_make_onclick(app, ck, n)
{
	return function()
	{
		let cv = app.colname[ck];
		//console.log(app.input, cv, n);
		if (app.input[ck].value)
		{
			app.input[ck].value = "";
		}
		else
		{
			app.input[ck].value = app.data[cv][n];
		}
		app.input[ck].oninput();
	}
}


function common_column_th(e, config, column)
{
	//console.log(column);
	switch(column)
	{
		case COLINDEX.DATETIME_STR:
			e.textContent = '📅 Time';
			break;
			case COLINDEX.CLIENT_IP:
			e.textContent = 'ClientIp';
			break;
		case COLINDEX.REQUEST_ID:
			e.textContent = 'RequestId';
			break;
		case COLINDEX.METHOD:
			e.textContent = 'Method';
			break;
		case COLINDEX.SOURCE_CONTEXT:
			e.textContent = 'SourceContext';
			break;
		case COLINDEX.MESSAGE:
			e.textContent = '💬 Message';
			break;
	}
}



function common_column_td(e, config, ck)
{
	let v;
	let cv = config.colname[ck];
	switch(cv)
	{
		case COLINDEX.DATETIME_STR:
			e.textContent = config.data[COLINDEX.DATETIME_STR][config.n];
			e.style.backgroundColor = random_hsla(e.textContent);
			e.ondblclick = app_make_onclick(config, ck, config.n);
			break;
		case COLINDEX.CLIENT_IP:
			e.textContent = config.data[COLINDEX.CLIENT_IP][config.n];
			e.style.backgroundColor = random_hsla(e.textContent);
			e.ondblclick = app_make_onclick(config, ck, config.n);
			break;
		case COLINDEX.REQUEST_ID:
			e.textContent = config.data[COLINDEX.REQUEST_ID][config.n];
			e.style.backgroundColor = random_hsla(e.textContent);
			e.ondblclick = app_make_onclick(config, ck, config.n);
			break;
		case COLINDEX.METHOD:
			v = config.data[COLINDEX.METHOD][config.n];
			e.style.width = "50px"
			if(v)
			{
				e.textContent = v;
				e.style.backgroundColor = random_hsla(v);
			}
			e.ondblclick = app_make_onclick(config, ck, config.n);
			break;
		case COLINDEX.SOURCE_CONTEXT:
			e.textContent = config.data[COLINDEX.SOURCE_CONTEXT][config.n];
			e.style.backgroundColor = random_hsla(e.textContent);
			e.ondblclick = app_make_onclick(config, ck, config.n);
			break;
		case COLINDEX.MESSAGE:
			let level = config.data[COLINDEX.LEVEL][config.n];
			e.style.backgroundColor = getcolor(level);
			e.ondblclick = app_make_onclick(config, ck, config.n);
			{
				let summary = document.createElement("summary");
				let m = config.data[COLINDEX.MESSAGE][config.n];
				let j = indexOf(m, "\n ", 30);
				summary.textContent = getlevel(level) + ' ' + m.substring(0, j);
				let details = document.createElement("details");
				details.appendChild(summary);
				//details.innerHTML += '<hr>' + m;
				details.innerHTML += '<br>' + m;
				e.appendChild(details);
			}
			break;
	}
}













function table_head(app)
{
	let tr;
	let th;
	tr = app.thead.insertRow(-1);
	for (let ck in app.colname)
	{
		let th = document.createElement('th');
		common_column_th(th, app, app.colname[ck])
		tr.appendChild(th);
	}
	tr = app.thead.insertRow(-1);
	for (let ck in app.colname)
	{
		th = table_insert_th(tr);
		app.input[ck] = document.createElement('input');
		app.input[ck].style.width = "100%";
		th.appendChild(app.input[ck]);
		app.input[ck].oninput = (e) =>
		{
			table_press(app, ck);
		}
	}
}


//Filter a column
function table_press(app, ck)
{
	//console.log(app);
	let children = app.tbody.children;
	let value = app.input[ck].value;
	let cv = app.colname[ck];
	for (let i = 0; i < children.length; i++)
	{
		let a = app.data[cv][i].includes(value);
		//Set bit (c) to (a)
		app.filter[i] &= ~(1 << cv);
		app.filter[i] |= (a << cv);
	}
	for (let i = 0; i < children.length; i++)
	{
		let index = children.length - 1 - i;
		children[index].style.visibility = (app.filter[i] == ~0) ? "visible" : "collapse";
	}
}

//Filter a row
function table_filter_one(app, i)
{
	let children = app.tbody.children;
	for (let ck in app.colname)
	{
		let cv = app.colname[ck];
		let value = app.input[ck].value;
		//console.log(app.data[cv][i], cv, i);
		let a = app.data[cv][i].includes(value);
		//Set bit (c) to (a)
		app.filter[i] &= ~(1 << cv);
		app.filter[i] |= (a << cv); 
	}
	let index = children.length - 1 - i;
	children[index].style.visibility = (app.filter[i] == ~0) ? "visible" : "collapse";
}















function app_append(app, row)
{
	//console.log(app.data);
	//["Time", "ClientIp", "RequestId", "Method", "SourceContext", "Message"];
	app.data[COLINDEX.DATETIME][app.n] = new Date(row["@t"]);
	app.data[COLINDEX.DATETIME_STR][app.n] = formatdate(new Date(row["@t"]));
	app.data[COLINDEX.CLIENT_IP][app.n] = row["ClientIp"] ? row["ClientIp"] : "";
	app.data[COLINDEX.REQUEST_ID][app.n] = row["RequestId"] ? row["RequestId"] : "";
	app.data[COLINDEX.METHOD][app.n] = row["Method"] ? row["Method"] : "";
	app.data[COLINDEX.SOURCE_CONTEXT][app.n] = row["SourceContext"] ? row["SourceContext"] : "";
	app.data[COLINDEX.MESSAGE][app.n] = row["@m"] ? row["@m"] : "";
	app.data[COLINDEX.LEVEL][app.n] = row["@l"];
	app.filter[app.n] = ~0;
	let tr = app.tbody.insertRow(0);
	for (let ck in app.colname)
	{
		let td = tr.insertCell(-1);
		common_column_td(td, app, ck);
		tr.appendChild(td);
	}
	table_filter_one(app, app.n);
	app.n++;
}





function table_init(app)
{
	app.tbody.innerHTML = "";
	app.thead.innerHTML = "";
	app.n = 0;
	app.data = [];
	app.filter = [];
	app.input = [];
	app.colname = [COLINDEX.DATETIME_STR, COLINDEX.CLIENT_IP, COLINDEX.REQUEST_ID, COLINDEX.SOURCE_CONTEXT, COLINDEX.MESSAGE];
	for (let ck in COLINDEX)
	{
		app.data[COLINDEX[ck]] = [];
	}
}

function ws_connect(app)
{
	//console.log(app);
	if(app.socket instanceof WebSocket)
	{
		app.socket.close();
	}
	app.socket = new WebSocket(app.wsurl);
	app.socket.onopen = function (event)
	{
		table_init(app);
		table_head(app);
	};
	app.socket.onclose = function (event)
	{
		console.log(event);
	};
	app.socket.onerror = function (event)
	{
		console.log(event);
	};
	app.socket.onmessage = function (event)
	{
		var row = JSON.parse(event.data);
		//console.log(row);
		app_append(app, row);
	};
};





let myapp = {};
myapp.table = document.getElementById("mytable");
myapp.thead = myapp.table.children[1];
myapp.tbody = myapp.table.children[2];


let e_btn_connect = document.getElementById("connect");
let e_input_myurl = document.getElementById("myurl");
e_input_myurl.value = ws_url("/wslog");

e_btn_connect.onclick = (e) =>
{
	myapp.wsurl = e_input_myurl.value;
	ws_connect(myapp);
}

myapp.wsurl = e_input_myurl.value;
ws_connect(myapp);