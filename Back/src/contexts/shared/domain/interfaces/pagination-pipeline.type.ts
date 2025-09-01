export type PipelineStage =
    | { $sort: { [key: string]: number } }
    | { $skip: number }
    | { $project: { _id: number } }
    | { $limit?: number };
