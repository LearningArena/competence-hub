using System;
using System.IO;
using System.Text;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

using Microsoft.AspNetCore.Http;

using Serilog;
using Serilog.Formatting.Compact;
using Serilog.Formatting.Json;
using Serilog.Configuration;
using Serilog.Core;
using Serilog.Events;


namespace Misc;


public class Serilog_WS_Sink : ILogEventSink
{
	IFormatProvider p;
	public static List<WebSocket> wss { get; set; } = new List<WebSocket>();
	static readonly JsonValueFormatter f = new JsonValueFormatter("$type");
	
	
	private static readonly ILogger log = Log.ForContext(typeof(Serilog_WS_Sink));

	public static async Task accept_ws(HttpContext context)
	{
		/*
		foreach (WebSocket w in wss)
		{
			log.Information("Websocket {@WebSocket}", w);
		}
		*/
		WebSocket ws = await context.WebSockets.AcceptWebSocketAsync();
		wss.Add(ws);
		log.Information("Adding new websocket {ws} to list. Websockets count {count}", ws.GetHashCode(), Serilog_WS_Sink.wss.Count);
		var buffer = new byte[1024 * 4];
		WebSocketReceiveResult result = await ws.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
		while (!result.CloseStatus.HasValue)
		{
			await ws.SendAsync(new ArraySegment<byte>(buffer, 0, result.Count), result.MessageType, result.EndOfMessage, CancellationToken.None);
			result = await ws.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
		}
		await ws.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
		wss.Remove(ws);
		log.Information("WebSocket {ws} closed. WebSocket count {count}", ws.GetHashCode(), wss.Count);
	}

	public static void beats()
	{
		int i = 0;
		while (true)
		{
			i++;
			//Log.Information("Beat " + i + "\n");
			Log.Error("Beat " + i + "\n");
			Thread.Sleep(5000);
		}
	}
	public static void startbeats()
	{
		Thread t = new Thread(beats);
		t.Start();
	}

	public Serilog_WS_Sink(IFormatProvider p)
	{
		this.p = p;
	}

	public void Emit(LogEvent e)
	{
		foreach (WebSocket ws in wss)
		{
			//string s = JsonSerializer.Serialize<LogEvent>(e);
			//Console.WriteLine(s);
			if ((ws != null) && (ws.State == WebSocketState.Open))
			{
				var buffer = new StringWriter();
				try
				{
					RenderedCompactJsonFormatter.FormatEvent(e, buffer, f);
					//CompactJsonFormatter.FormatEvent(e, buffer, f);
				}
				catch (Exception ex)
				{
					Console.WriteLine(ex.Message);
				}
				var bytes = Encoding.ASCII.GetBytes(buffer.ToString());
				var arraySegment = new ArraySegment<byte>(bytes);
				ws.SendAsync(arraySegment, WebSocketMessageType.Text, true, CancellationToken.None);
			}
		
		}
	}
}


public static class Serilog_WS_Sink_Extension
{
	public static LoggerConfiguration Serilog_WS_Sink(this LoggerSinkConfiguration c, IFormatProvider p = null)
	{
		return c.Sink(new Serilog_WS_Sink(p));
	}
}
