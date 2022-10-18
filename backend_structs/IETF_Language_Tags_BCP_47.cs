using System.Collections.Generic;
using System.Linq;

static class IETF_Language_Tags_BCP_47
{
    // BCP-47 language tags can have one OR more subtags sepaarated by hyphens,
    // the first of which is the primary ISO-639 language subtag. BCP-47 tags are
    // used e.g. in the schema.org Course model.

    // Select Swedish BCP-47 language tags, as gathered from MS docs with additions
    // from list of most used languages in Sweden.
    static Dictionary<string, string> svNameTags = new Dictionary<string, string>
    {
        {"arabiska","ar"},
        {"arameiska","arc"},
        {"bulgariska","bg"},
        {"katalanska","ca"},
        {"Kroatiska","hr"},
        {"tjeckiska","cs"},
        {"danska","da"},
        {"tyska","de"},
        {"grekiska","el"},
        {"engelska","en"},
        {"spanska","es"},
        {"estniska","et"},
        {"persiska","fa"},
        {"filippinska","fil"},
        {"finska","fi"},
        {"franska","fr"},
        {"gujarati","gu"},
        {"hindi","hi"},
        {"ungerska","hu"},
        {"indonesiska","id"},
        {"irländskt","ga"},
        {"italienska","it"},
        {"japanska","ja"},
        {"koreanska","ko"},
        {"kurdiska","ku"},
        {"lettiska","lv"},
        {"litauiska","lt"},
        {"malajiska","ms"},
        {"maltesiska","mt"},
        {"marathi","mr"},
        {"norska","nb"},
        {"nederländska","nl"},
        {"polska","pl"},
        {"portugisiska","pt"},
        {"rumänska","ro"},
        {"ryska","ru"},
        {"slovakiska","sk"},
        {"slovenska","sl"},
        {"somaliska","so"},
        {"albanska","sq"},
        {"svenska","sv"},
        {"tamiliska","ta"},
        {"telugu","te"},
        {"thailändska","th"},
        {"turkiska","tr"},
        {"vietnamesiska","vi"},
        {"kinesiska","zh"}
    };

    static Dictionary<string, string> enNameTags = new Dictionary<string, string>
    {
        {"arabic","ar"},
        {"aramaic","arc"},
        {"bulgarian","bg"},
        {"catalan","ca"},
        {"croatian","hr"},
        {"czech","cs"},
        {"danish","da"},
        {"german","de"},
        {"greek","el"},
        {"engelska","en"},
        {"spanish","es"},
        {"estonian","et"},
        {"persian","fa"},
        {"filipino","fil"},
        {"finnish","fi"},
        {"french","fr"},
        {"gujarati","gu"},
        {"hindi","hi"},
        {"hungarian","hu"},
        {"indonesian","id"},
        {"irish","ga"},
        {"italian","it"},
        {"japanese","ja"},
        {"korean","ko"},
        {"kurdish","ku"},
        {"latvian","lv"},
        {"lithuanian","lt"},
        {"malay","ms"},
        {"maltese","mt"},
        {"marathi","mr"},
        {"norwegian","nb"},
        {"dutch","nl"},
        {"polish","pl"},
        {"portuguese","pt"},
        {"romanian","ro"},
        {"russian","ru"},
        {"slovak","sk"},
        {"slovenian","sl"},
        {"somali","so"},
        {"albanian","sq"},
        {"swedish","sv"},
        {"tamil","ta"},
        {"telugu","te"},
        {"thai","th"},
        {"turkish","tr"},
        {"vietnamese","vi"},
        {"chinese","zh"}
    };
    
    // get one tag from language string match
    public static string FirstCommonTagFromName(string name, string nameLang = "sv")
    {
        try
        {
            if (nameLang == "en")
                return enNameTags.First(x => x.Key.Contains(name.ToLower())).Value;
            else
                return svNameTags.First(x => x.Key.Contains(name.ToLower())).Value;
        }
        catch {return null;}
        
    }

}