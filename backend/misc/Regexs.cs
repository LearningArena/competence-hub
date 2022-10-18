using System.Text.RegularExpressions;

namespace Misc;

public static class Regexs
{
	
	//https://bolagsverket.se/ff/foretagsformer/organisationsnummer-1.7902
	public static readonly Regex organisationsnummer = new Regex(@"^\d{6}-\d{4}$");

}
