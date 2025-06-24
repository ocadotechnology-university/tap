export declare const getTeamAssessments: () => import("react-use/esm/useAsyncFn").AsyncState<{
    allUsers: {
        id: any;
        name: any;
        displayName: any;
        email: any;
        picture: any;
        hasAssessment: boolean;
    }[];
    assessedUsers: any;
    hasAssessment: (userId: string) => any;
}>;
