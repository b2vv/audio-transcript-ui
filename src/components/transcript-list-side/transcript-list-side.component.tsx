import React from 'react';
import {TranscriptionService} from "@src/api/transcription.service.ts";

import styles from './index.module.css';

import {AnglesRight} from "@src/components/icons/angles-right";
import {AngleRight} from "@src/components/icons/angle-right.tsx";
import {AngleLeft} from "@src/components/icons/angle-left.tsx";
import {AnglesLeft} from "@src/components/icons/angles-left.tsx";


interface ITranscriptListSideProps {
    api: TranscriptionService;
}

interface ITranscript {
    text: string;
    date: string;
    fileName: string;
}

interface IState {
    query: string;
    page: number;
    limit: number;
    count: number;
}

export const TranscriptListSideComponent: React.FC<ITranscriptListSideProps> = React.memo((props) => {
    const {api} = props;
    const reg = React.useMemo(() => /^\d+$/, []);
    const [transcripts, setTranscripts] = React.useState<ITranscript[]>([]);
    const state = React.useRef<IState>({
        query: '',
        page: 1,
        limit: 5,
        count: 0
    });

    const [inputPage, setInputPage] = React.useState<string>('1');

    const search = React.useCallback(() => {
        const {query, page, limit} = state.current;
        const offset = (page - 1) * limit;
        api.search({query, limit, offset}).then(({data}) => {
            const {list, count} = data;
            state.current.count = count;
            const regex = new RegExp(query, 'gi');

            const segments = list.map((item) => ({
                fileName: item['file-name'],
                date: new Date().toISOString().split('T')[0],
                text: item.segments.map((item) => {
                    let text = item.text
                    text = text.replace(/(<mark class="highlight">|<\/mark>)/gim, '');
                    return text.replace(regex, '<mark class="highlight">$&</mark>');
                }).join('\n').trim()
            }));

            setTranscripts(segments);
        });
    }, [api]);

    const changeQueryHandler = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        // setQuery(e.target.value)
        state.current.query = e.target.value;
    }, []);

    const firstPageHandler = React.useCallback(() => {
        state.current.page = 1;
        setInputPage(state.current.page + '');
        search();
    }, [search]);

    const prevPageHandler = React.useCallback(() => {
        state.current.page -= 1;
        setInputPage(state.current.page + '');
        search();
    }, [search]);

    const nextPageHandler = React.useCallback(() => {
        state.current.page += 1;
        setInputPage(state.current.page + '');
        search();
    }, [search]);

    const lastPageHandler = React.useCallback(() => {
        state.current.page = Math.ceil(state.current.count / state.current.limit);
        setInputPage(state.current.page + '');
        search();
    }, [search]);

    const changePageHandler = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const input = e.target.value;
        if (reg.test(input)) {
            state.current.page = +input;
            search();
        }
        setInputPage(state.current.page + '');
    }, [reg, search]);

    const changeInputPageHandler = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputPage(e.target.value);
    }, []);



    const clickSearchHandler = React.useCallback(() => {
        state.current.page = 1;
        search();
    }, [search]);

    React.useEffect(() => {
        search();
    }, [search])

    const {page,count, limit, query} = state.current;

    const hasPrev = page > 1;
    const hasNext = page < Math.ceil(count / limit);

    return (
        <div className={styles.page}>
            <div className={styles.actions}>
                <div className={styles.action}>
                    <input defaultValue={query} onChange={changeQueryHandler}/>
                    <button onClick={clickSearchHandler}>Search</button>
                </div>

                <div className={styles.action}>
                    <button className={styles.btn} disabled={!hasPrev} onClick={firstPageHandler}>{AnglesLeft}</button>
                    <button className={styles.btn} disabled={!hasPrev} onClick={prevPageHandler}>{AngleLeft}</button>

                    <input
                        disabled={!hasPrev && !hasNext}
                        onChange={changeInputPageHandler}
                        onBlur={changePageHandler}
                        value={inputPage}
                    />

                    <button className={styles.btn} disabled={!hasNext} onClick={nextPageHandler}>{AngleRight}</button>
                    <button className={styles.btn} disabled={!hasNext} onClick={lastPageHandler}>{AnglesRight}</button>
                </div>
            </div>
            <article className={styles.list}>
                {transcripts.map((item, index) => (
                    <div key={`${index}${item.fileName}-${item.date}`} className={styles['file-info']}>
                        <h2 className={styles.title}>{item.fileName}</h2>
                        <div className={styles.date}>{item.date}</div>
                        <p className={styles.text} dangerouslySetInnerHTML={{__html: item.text}} />
                    </div>
                ))}
            </article>
        </div>
    );

});

TranscriptListSideComponent.displayName = 'TranscriptListSideComponent';
