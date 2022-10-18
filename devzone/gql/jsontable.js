/*
Depends on misc.js

This creates a recursive HTML table from a javascript object.
It can be used to present data from a GraphQL response.

*/


function jsontable_string(e, s)
{
	let maxlen = 100;
	if (s.length > maxlen)
	{
		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
		// <details>
		// <summary>Details</summary>
		// Something small enough to escape casual notice.
		// </details>
		var summary = document.createElement("summary");
		summary.textContent = s.substring(0, maxlen);
		var details = document.createElement("details");
		details.appendChild(summary);
		details.innerHTML += s;
		e.appendChild(details);
		return;
	}
	let emoji = get_fext_emoji(s);
	if (emoji != '❔')
	{
		let a = document.createElement('a');
		e.textContent = emoji + ' ';
		e.appendChild(a);
		a.innerText = s;
		a.href = s;
		return;
	}
	e.textContent = s;
}


function jsontable(e, x)
{
	//console.log(x, typeof x);
	if (x === null)
	{
		e.textContent = "null";
	}
	else if (typeof x === "boolean")
	{
		e.textContent = x;
	}
	else if (typeof x === "number")
	{
		e.textContent = x;
	}
	else if (typeof x === "string")
	{
		jsontable_string(e, x);
	}
	else if (Array.isArray(x) && (x.length == 0))
	{
		e.textContent = "[EMPTY]";
	}
	else if (Array.isArray(x) && (x.length > 0))
	{
		let table = document.createElement("table");
		if (typeof x[0] === "object")
		{
			let tr = table.insertRow(-1);
			for (let i in x[0])
			{
				let c = x[0][i];
				let th = document.createElement("th");
				th.textContent = i;
				tr.appendChild(th);
			}
		}
		for (let i in x)
		{
			let tr = table.insertRow(-1);
			if (typeof x[i] === "object")
			{
				for (let j in x[i])
				{
					let c = x[i][j];
					let td = tr.insertCell(-1);
					jsontable(td, c);
				}
			}
			else
			{
				let td = tr.insertCell(-1);
				jsontable(td, x[i]);
			}
		}
		e.appendChild(table);
	}
	else if (typeof x === "object")
	{
		let table = document.createElement("table");
		for (let i in x)
		{
			let tr = table.insertRow(-1);
			let th = document.createElement("th");
			th.textContent = i;
			tr.appendChild(th);
			let td = tr.insertCell(-1);
			//console.log("OBJ", i, x[i]);
			jsontable(td, x[i]);
		}
		e.appendChild(table);
	}
	else
	{
	}
}

