let e_queryarea = document.getElementById("queryarea");
let e_tables = document.getElementById("tables");
let e_url = document.getElementById("url");
let e_response = document.getElementById('response');
e_url.value = arena_graphql_endpoint;


document.getElementById('POST').onclick = (e) =>
{
	let q = e_queryarea.value;
	//console.log('GraphQL request query:', q);
	graphql_request(e_url.value, q, (data) =>
	{
		e_tables.innerHTML = '';
		e_response_innerHTML = JSON.stringify(data);
		//console.log('GraphQL response data:', data);
		jsontable(e_tables, data);
	});
};


function hashchange()
{
	let xhr = new XMLHttpRequest();
	//x.overrideMimeType("application/text");
	let filename = location.hash.substring(1); // Remove # from url and return rest of it
	//console.log(filename);
	if (filename.length <= 0) {return;}
	xhr.open('GET', filename, true);
	xhr.onreadystatechange = () =>
	{
		if (xhr.readyState !== 4){return;}
		if (xhr.status !== 200){return;}
		e_queryarea.value = xhr.responseText;
	};
	xhr.send(null);
}
window.addEventListener('hashchange', hashchange, false);
window.addEventListener('DOMContentLoaded', hashchange);