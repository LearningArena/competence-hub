using System;
using System.Text;
using System.Security.Claims;
using System.Data;

namespace Misc;



public static class HTML_DataTable
{
	public static void css_template1(StringBuilder s)
	{
		s.Append("table {border-collapse: collapse;background-color: rgb(241, 239, 236);font-size: 12px;}");
		s.Append("td,th {border: 1px solid #cdc9c1;text-align: left;padding: 4px;font-family: Arial;}");
		s.Append("th {background-color: #33322e;color: #fff;}");
		s.Append("td {}");
	}

	public static String create_table(DataTable t)
	{
		StringBuilder s = new StringBuilder();
		s.Append("<html><head><meta charset=\"utf-8\"/><style>");
		css_template1(s);
		s.Append("</style></head><body>");
		s.Append("<table>");
		s.Append("<tr>");
		foreach (System.Data.DataColumn col in t.Columns)  
		{
			s.Append("<th>");
			s.Append(col.ColumnName);
			s.Append("</th>");
		}
		s.Append("</tr>");
		foreach (System.Data.DataRow row in t.Rows)  
		{  
			s.Append("<tr>");
			foreach (System.Data.DataColumn col in t.Columns)  
			{  
				s.Append("<td>");
				s.Append(row[col]); 
				s.Append("</td>");
			}
			s.Append("</tr>");
		}

		s.Append("</table>");
		s.Append("</body></html>");
		return s.ToString();
	}

	public static String create_table(ClaimsPrincipal cp)
	{
		StringBuilder s = new StringBuilder();
		s.Append("<html><head><style>");
		css_template1(s);
		s.Append("</style></head><body>");
		s.Append("<table>");
		s.Append("<tr>");
		s.Append("<th>Type</th>");
		s.Append("<th>ValueType</th>");
		s.Append("<th>Value</th>");
		s.Append("<th>Issuer</th>");
		s.Append("<th>OriginalIssuer</th>");
		s.Append("<th>Properties</th>");
		s.Append("</tr>");
		foreach (Claim claim in cp.Claims)
		{
			s.Append("<tr>");
			s.Append("<td>" + claim.Type + "</td>");
			s.Append("<td>" + claim.ValueType + "</td>");
			s.Append("<td>" + claim.Value + "</td>");
			s.Append("<td>" + claim.Issuer + "</td>");
			s.Append("<td>" + claim.OriginalIssuer + "</td>");

			s.Append("<td><span>");
			foreach (var kv in claim.Properties)
			{
				s.Append(kv.Key + " : " + kv.Value + "\n");
			}
			s.Append("</span></td>");

			s.Append("</tr>");
		}
		s.Append("</table>");
		s.Append("</body></html>");
		return s.ToString();
	}
}
