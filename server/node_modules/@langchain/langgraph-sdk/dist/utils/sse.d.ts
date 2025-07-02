export declare function BytesLineDecoder(): TransformStream<Uint8Array, Uint8Array>;
interface StreamPart {
    id: string | undefined;
    event: string;
    data: unknown;
}
export declare function SSEDecoder(): TransformStream<Uint8Array, StreamPart>;
export {};
