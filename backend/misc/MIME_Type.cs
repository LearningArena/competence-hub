namespace Misc;

/*
TODO: Add all file signatures:
https://en.wikipedia.org/wiki/List_of_file_signatures
https://stackoverflow.com/questions/62329321/how-can-i-check-a-base64-string-is-a-filewhat-type-or-not
*/
public static class MIME_Type
{

	public static readonly byte[] BMP = { 0x42, 0x4D };
	public static readonly byte[] JPG = { 0xFF, 0xD8, 0xFF };
	public static readonly byte[] PNG = {0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A};
	public static readonly byte[] GIF1 = {0x47, 0x49, 0x46, 0x38, 0x37, 0x61};
	public static readonly byte[] GIF2 = {0x47, 0x49, 0x46, 0x38, 0x39, 0x61};
	public static readonly byte[] RIFF = {0x52, 0x49, 0x46, 0x46};
	public static readonly byte[] WEBP = {0x57, 0x45, 0x42, 0x50};//RIFF????WEBP. From byte 8..11
	public static readonly byte[] WAV = {0x52, 0x49, 0x46, 0x46};//RIFF????WAVE. From byte 8..11

	public static string get_file_extension(byte[] bytes)
	{
		if (bytes == null){return null;}
		else if (Memory.equal(bytes, BMP, BMP.Length)){return ".bmp";}
		else if (Memory.equal(bytes, PNG, PNG.Length)){return ".png";}
		else if (Memory.equal(bytes, JPG, JPG.Length)){return ".jpg";}
		else if (Memory.equal(bytes, GIF1, GIF1.Length)){return ".gif";}
		else if (Memory.equal(bytes, GIF2, GIF2.Length)){return ".gif";}
		else if (Memory.equal(bytes, RIFF, RIFF.Length))
		{
			if (false){}
			else if (Memory.equal(bytes, 8, WEBP, WEBP.Length)){return ".webp";}
			else if (Memory.equal(bytes, 8, WAV, WAV.Length)){return ".wav";}
		}
		return null;
	}


};
