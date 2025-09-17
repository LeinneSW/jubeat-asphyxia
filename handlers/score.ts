import {Score} from "../models/score";

export const getScoreRoute = async (data: any, send: WebUISend) => {
    const refid = (data.refid || '').toString().trim().toUpperCase();
    if(!refid)
        return send.json({});

    const scores = await DB.Find<Score>(refid, {collection: "score"});

    const newScores = {};
    for(const scoreData of scores){
        if(scoreData.isHardMode) continue;
        newScores[scoreData.musicId] ??= [];
        if(
            !newScores[scoreData.musicId][scoreData.seq] ||
            newScores[scoreData.musicId][scoreData.seq].score < scoreData.score
        ){
            newScores[scoreData.musicId][scoreData.seq] = scoreData
        }
    }
    send.json(Object.values(newScores));
};
