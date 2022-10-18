global.element_summery = document.getElementById("summery");
global.element_doc = document.getElementById("doc");

function generate_doc(e, api, tablename)
{
	console.assert(api.components);
	console.assert(api.collection);
	console.assert(tablename);
	let article0 = document.createElement("article");
	let h1a = document.createElement("header");
	h1a.id = "doc_"+tablename;
	h1a.innerText = tablename;
	article0.appendChild(h1a);
	let compcollection = api.collection[tablename];
	for (i in compcollection)
	{
		let component = compcollection[i];
		let jsonld_id = api.components_jsonld[component]?.['@id'];
		let comment = global.schemaorg?.[jsonld_id]?.['rdfs:comment'];
		//console.log(jsonld_id, api.schemaorg);

		let box = document.createElement("article");
		let h2 = document.createElement("header");
		let article1 = document.createElement("article");
		let article2 = document.createElement("article");
		let article3 = document.createElement("article");
		let article4 = document.createElement("article");
		let article5 = document.createElement("article");
		let header1 = document.createElement("header");
		let header2 = document.createElement("header");
		let section1 = document.createElement("section");
		let section2 = document.createElement("section");
		article1.appendChild(header1);
		article1.appendChild(section2);
		article2.appendChild(header2);
		article2.appendChild(section2);
		article2.appendChild(article3);

		h2.innerText = component;
		article3.innerText = "perm: " + api.components[component].perm;
		article4.innerText = "type: " + api.components[component].type;
		article5.innerText = "importance: " + api.components[component].importance;

		header1.innerText = "arena:comment";
		header2.innerText = "rdfs:comment";
		
		section1.innerText = api.components_description[component];
		section2.innerText = comment?.replace(/(\\r)|(\\n)/g,"\n");

		box.appendChild(h2);
		box.appendChild(article3);
		box.appendChild(article4);
		box.appendChild(article5);
		box.appendChild(article1);
		box.appendChild(article2);
		article0.appendChild(box);
	}
	e.appendChild(article0);
}

function generate_docs(api)
{
	global.element_doc.innerHTML = "";
	for(g in api.collection)
	{
		let a = document.createElement("a");
		a.href = "#doc_" + g;
		a.innerText = g;
		global.element_summery.appendChild(a);
		generate_doc(global.element_doc, api, g);
	}
}

Promise.all([global.promise_api, global.promise_jsonld]).then((values) =>
{
	global.api = values[0];
	global.schemaorg = values[1];
	console.log(global.schemaorg['schema:price']);
	generate_docs(global.api);
});