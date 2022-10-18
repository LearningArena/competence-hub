let Navstate = {};

Navstate.stringify = (navstate) =>
{
	let h = "#"+JsonURL.stringify(navstate, { AQF: true });
	return h;
}


Navstate.get = () =>
{
	let h = window.location.hash.substring(1);
	// TODO: Sometime JsonURL doesn't work. Why?
	// Try parsing multiple times:
	let navstate = null;
	for (let i = 0; i < 1; ++i)
	{
		try
		{
			navstate = JsonURL.parse(h, { AQF: true });
			if(Array.isArray(navstate.c) == false){navstate.c = [];}
			if(navstate.a !== Object(navstate.a)){navstate.a = {};}
			for (let i in navstate.c)
			{
				let cname = navstate.c[i];
				if(Array.isArray(navstate.a[cname]) == false){navstate.a[cname] = [];}
			}
		}
		catch(error)
		{
			console.warn("hashchange: JsonURL.parse failed", h);
			navstate = null;
		}
	}

	return navstate;
}


Navstate.set = (navstate) =>
{
	let h = Navstate.stringify(navstate);
	//console.log("navigateto: ", navstate, h);
	window.location.hash = h;
	//console.log("navigateto", h);
}