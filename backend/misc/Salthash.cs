using System;
using System.Diagnostics;
using System.Security.Cryptography;


// https://stackoverflow.com/questions/2138429/hash-and-salt-passwords-in-c-sharp


namespace Misc;

public static class Salthash
{


	//
	// Summary:
	//     Creates a byte array that contains both salt and hash values.
	//
	// Parameters:
	//   password:
	//     The password to hash.
	//   sn:
	//     The number of cryptographically strong sequence of random values for salt part. Must by atleast 8.
	//   pn:
	//     The number of pseudo-random key bytes to generate for hash part. Must be positive.
	//   n:
	//     The number of iterations for the operation.
	//
	// Returns:
	//     A byte array of salt and hashed values. (S1, S2, ... sn, H1, H2, ... pn)
	public static byte[] create(string password, int sn, int pn, int n, HashAlgorithmName algorithm)
	{
		byte[] salt = RandomNumberGenerator.GetBytes(sn);
		//PBKDF2 Password-Based Key Derivation Function 2
		byte[] hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, n, algorithm, pn);
		byte[] salthash = new byte[sn+pn];
		Array.Copy(salt, 0, salthash, 0, sn);
		Array.Copy(hash, 0, salthash, sn, pn);
		return salthash;
	}


	//
	// Summary:
	//     Compares raw password with hashed password.
	//
	// Parameters:
	//   salthash:
	//     The salt and hashed password to compare. (Salt, Hash) = (S1, S2, ... sn, H1, H2, ... pn)
	//   password:
	//     The raw password to compare.
	//   sn:
	//     The number of cryptographically strong sequence of random values. Must by atleast 8.
	//   pn:
	//     The number of pseudo-random key bytes to generate. Must be positive.
	//   n:
	//     The number of iterations for the operation.
	//
	// Returns:
	//     Matched or not matched password
	public static bool verify(string password, byte[] salthash, int sn, int pn, int n, HashAlgorithmName algorithm)
	{
		// Copy only the salt bytes from salthash:
		byte[] salt = new byte[sn];
		Array.Copy(salthash, 0, salt, 0, sn);
		// PBKDF2 Password-Based Key Derivation Function 2
		byte[] hash1 = Rfc2898DeriveBytes.Pbkdf2(password, salt, n, algorithm, pn);
		// Copy only the hash bytes from salthash:
		byte[] hash2 = new byte[pn];
		Array.Copy(salthash, sn, hash2, 0, pn);
		return CryptographicOperations.FixedTimeEquals(hash1, hash2);
	}


	public static void assert_salthash()
	{
		HashAlgorithmName a = HashAlgorithmName.SHA256;
		string pw1 = "abc";
		string pw2 = "abC";
		byte[] salthash;

		salthash = create(pw1, 8, 1, 1, a);
		Debug.Assert(verify(pw1, salthash, 8, 1, 1, a) == true);
		Debug.Assert(verify(pw2, salthash, 8, 1, 1, a) == false);

		salthash = create(pw1, 8, 2, 1, a);
		Debug.Assert(verify(pw1, salthash, 8, 2, 1, a) == true);
		Debug.Assert(verify(pw2, salthash, 8, 2, 1, a) == false);

		salthash = create(pw1, 8, 100, 1, a);
		Debug.Assert(verify(pw1, salthash, 8, 100, 1, a) == true);
		Debug.Assert(verify(pw2, salthash, 8, 100, 1, a) == false);
	}



}



public class Passwords
{
	static private readonly int sn = 32; // 256 bits of salt
	static private readonly int pn = 32; // 256 bits of hash
	static private readonly int iterations = 100000;
	static private readonly HashAlgorithmName algorithm = HashAlgorithmName.SHA256;

	//Generated salthash. Password is secret.
	static public readonly byte[] salthash1 = {0x1F,0xFB,0x4F,0x32,0x70,0xBB,0x97,0x12,0x3A,0x7A,0x7D,0x88,0xF1,0x21,0x6B,0x79,0x83,0x6A,0xD7,0xBC,0xDB,0x57,0xD8,0x6F,0x35,0x29,0x0C,0x1C,0xAF,0x07,0x91,0x30,0x5C,0x97,0x4D,0xE9};
	static public readonly byte[] salthash0 = {0x31,0x14,0x50,0xB3,0xD9,0x89,0x7A,0x4C,0x99,0x10,0x0E,0xCC,0x6E,0x0A,0x35,0x14,0x9C,0x0C,0x0D,0x08,0xA0,0xE8,0xEC,0x29,0xDB,0x4C,0xD9,0x6F,0xA6,0x8D,0x33,0x5A,0x82,0x3E,0xF0,0x3C};



	public static byte[] create(string password)
	{
		return Salthash.create(password, sn, pn, iterations, algorithm);
	}

	public static bool verify(string password, byte[] salthash)
	{
		return Salthash.verify(password, salthash, sn, pn, iterations, algorithm);
	}
}