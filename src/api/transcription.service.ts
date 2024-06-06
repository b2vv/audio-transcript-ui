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

interface TranscriptionListItem {
    segments: SegmentFile[];
    'file-name': string;
    time: string;
}

interface TranscriptionList {
    list: TranscriptionListItem[];
    count: number;
}

export class TranscriptionService extends ApiErrorService{
    private api = new ApiRequestService();

    public sendAudio(form: FormData) {
        return this.api.post<TranscriptionFile>('/process', form);
    }

    public search(data: {query: string; offset: number; limit: number}) {
        const {query: q, offset, limit = 25} = data;
        const query = !q ? '.*' : `^.*${q}.*$`;
        return this.api.get<TranscriptionList>('/search', {query, offset, limit});
    }
}