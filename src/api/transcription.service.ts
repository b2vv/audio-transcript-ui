import {ApiRequestService} from "@src/api/api-request.service.ts";
import {ApiErrorService} from "@src/api/api-error.service.ts";

interface SegmentFile {
    end: number,
    start: number,
    text: string
}

export interface TranscriptionFile {
    segments: SegmentFile[]
}

export class TranscriptionService extends ApiErrorService{
    private api = new ApiRequestService();

    public sendAudio(form: FormData) {
        return this.api.post<TranscriptionFile>('/process', form);
    }
}