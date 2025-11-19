import { Transport, http } from "viem";

export interface RPCCallLog {
  method: string;
  startTime: number;
  endTime: number;
  duration: number;
}

export function createInstrumentedTransport(
  url: string | undefined,
  onRPCCall: (log: RPCCallLog) => void
): Transport {
  const baseTransport = http(url);

  return (params) => {
    const transport = baseTransport(params);

    return {
      ...transport,
      request: async (request) => {
        const startTime = Date.now();
        
        try {
          const result = await transport.request(request);
          const endTime = Date.now();
          
          onRPCCall({
            method: request.method,
            startTime,
            endTime,
            duration: endTime - startTime,
          });
          
          return result;
        } catch (error) {
          const endTime = Date.now();
          
          onRPCCall({
            method: request.method,
            startTime,
            endTime,
            duration: endTime - startTime,
          });
          
          throw error;
        }
      },
    };
  };
}

