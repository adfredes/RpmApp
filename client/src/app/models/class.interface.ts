export interface Class{
    id: number;
    dateOfClass: Date;
    duration: number;
    level: string;
    capacity: number;
    quota: number;
    teacher: string;
    teacherPhotoUrl: string;
    studentsSubscription: StudenSubscription[];
}

export interface StudenSubscription{
    studentId: number;
    name: string;
    isAssist?: boolean;
    avatar: string;
}
