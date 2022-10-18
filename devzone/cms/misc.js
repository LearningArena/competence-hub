function swap_ab(arr, a, b)
{
	let ai = arr.indexOf(a);
	let bi = arr.indexOf(b);
	[arr[ai], arr[bi]] = [arr[bi], arr[ai]];
}


function graphql_stringify(value)
{
	let json = JSON.stringify(value);
	return json.replace(/"([^(")"]+)":/g,"$1:");
}

function clonedata(value)
{
	let data = JSON.parse(JSON.stringify(value));
	return data;
}

function isalpha(ch)
{
	return typeof ch === "string" && ch.length === 1 && (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z");
  }