using HotChocolate.Types;
using Serilog;

namespace Arena;

[ExtendObjectType(OperationTypeNames.Query)]
public class Chatbot_Query
{
	private readonly Serilog.ILogger log = Log.ForContext<Chatbot_Query>();

	public string chatbot_prompt(Chatbot_Kind kind, string content)
	{
		switch(kind)
		{
			case Chatbot_Kind.OPENAI_GPT_3_5_TURBO:
				return OpenAI_Functions.prompt(content);
		}
		return "";
	}


}
