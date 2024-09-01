export type IfUnknown<T, TrueType, FalseType> = unknown extends T
    ? T extends unknown
        ? TrueType
        : FalseType
    : FalseType;
