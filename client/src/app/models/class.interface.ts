export interface Class{
    id: number;
    dateOfClass: Date;
    duration: number;
    level: string;
    capacity: number;
    quota: number;
    teacherId: number;
    teacher: string;
    teacherPhotoUrl: string;
    suspended: boolean;
    studentsSubscription: StudenSubscription[];
}

export interface StudenSubscription{
    studentId: number;
    name: string;
    isAssist?: boolean;
    avatar: string;
}
