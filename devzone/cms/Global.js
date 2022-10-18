let Global = {};
Global.element_table = document.getElementById("table");
Global.element_left = document.getElementById("left");
Global.element_middle = document.getElementById("middle");
Global.element_right = document.getElementById("right");
Global.element_totalCount = document.getElementById("totalCount");
Global.element_collections = document.getElementById("collections");
Global.element_components = document.getElementById("components");
Global.element_home = document.getElementById("home");


Global.api = {};
Global.promise_api = fetch('api.json').then(r => r.json());
Global.promise_jsonld = fetch('https://schema.org/version/latest/schemaorg-current-https.jsonld').then(r => r.json()).then(r => {
	let h = {};
	let g = r['@graph'];
	for(i in g)
	{
		let id = g[i]['@id'];
		h[id] = g[i];
	}
	return h;
});
Global.current_table = "";




// Special graphql queries:
Global.dollarfx_graphql1 = 
{
	"$ebox" : (cnamev, args) =>
	{
		return `edged_${cnamev[1]}_${cnamev[2]}_${cnamev[3]}`;
	}
};

Global.dollarfx_graphql2 = 
{
	"$ebox" : (cnamev, args) =>
	{
		return `has_edge(t:${cnamev[1]},id:${cnamev[2]},relation:${cnamev[3]})`;
	}
};


function parse_by_cname(value, cname)
{
	let t = Global.api.components[cname]?.type;
	switch(t)
	{
	case "int": return parseInt(value);
	default: return value;
	}
}


function get_filter_from_cname(value, cname)
{
	let t = Global.api.components[cname]?.type;
	switch(t)
	{
	case "int": 
		value = parseInt(value);
		if (!isNaN(value))
		{
			return `{${cname}:{eq:${value}}}`;
		}
		break;
	case "enum": 
		if (value && value.length > 0)
		{
			return `{${cname}:{eq:${value}}}`;
		}

	case "string": 
	default:
		if (value && value.length > 0)
		{
			return `{${cname}:{contains:"${value}"}}`;
		}
		break;
	}

	return null;
}


