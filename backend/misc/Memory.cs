namespace Misc;

public static class Memory
{
	public static bool equal(byte[] a, byte[] b, int count)
	{
		for (int i = 0; i < count; ++i)
		{
			if (a[i] != b[i])
			{
				return false;
			}
		}
		return true;
	}

	public static bool equal(byte[] a, int a_offset, byte[] b, int count)
	{
		for (int i = 0; i < count; ++i)
		{
			if (a[i+a_offset] != b[i])
			{
				return false;
			}
		}
		return true;
	}
}
