using System;

namespace Arena;



/*
https://leapgraph.com/graphql-file-uploads/
This is a temporary solution to convert dataurl to file.
Frontend is uploading base64 images through GraphQL as dataurl.
Frontend could use REST instead and it might be be a better solution:
	POST /images HTTP/1.1
	Host: localhost:4000
	Content-Type: image/jpeg
	Content-Length: 1254

	raw image content
*/
public static class Arena_DataURL
{

	/*
	https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs

	Syntax:
	data:[<mediatype>][;base64],<data>

	Expect:
	data:<mediatype>,<data>

	Mediatype is not important because file signature can be retrived from the first couple of bytes.
	*/
	public static byte[] get_data(string dataurl)
	{
		int i = dataurl.IndexOf(','); //The base64 string data is after comma
		if (i < 0) {return null;} //No comma found is considered unvalid dataurl
		string str64 = dataurl.Substring(i + 1); //Get the stringe after comma
		byte[] bytes = Convert.FromBase64String(str64);
		return bytes;
	}

	//
	// Summary:
	//     Sava a dataurl file that gets reference in database.
	// Returns:
	//     Path to file if succesful.
	//     URL if its just a URL.
	//     Null if failed.
	public static string refsave(Arena_Context context, int user_id, string dataurl)
	{
		byte[] bytes = get_data(dataurl);
		if (bytes == null) {return null;}
		string file_extension = Misc.MIME_Type.get_file_extension(bytes);
		if (file_extension == null) {return null;}
		return Arena_Files.refsave(context, user_id, bytes, file_extension);
	}


	//
	// Summary:
	//     Sava a dataurl image that gets reference in database.
	//     If dataurl image is not detected no reference will be created.
	//     If user_id is zero then no one will own the image.
	// Returns:
	//     Path to file if succesful.
	//     URL if its just a URL.
	//     Null if failed.
	public static string refsave_image(Arena_Context context, string dataurl, int user_id)
	{
		if (dataurl == null) {return null;}
		if (dataurl == "") {return dataurl;}
		// Syntax: data:[<mediatype>][;base64],<data>
		// Expect: data:image,<data>

		//TODO Testing, for testing purpose only, should remove this later:
		if (dataurl[0] == '$') {return dataurl.Remove(0, 1);}

		if (dataurl.Length > 10 && dataurl.Substring(0, 10) == "data:image")
		{
			return refsave(context, user_id, dataurl);
		}
		return dataurl;
	}

}
