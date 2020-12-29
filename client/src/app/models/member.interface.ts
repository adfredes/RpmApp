import { Photo } from './photo.interface';
export interface Member {
    knownAs: string;
    created: Date;
    lastActive?: Date;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    dateOfAdmission?: Date;
    gender: string;
    genderId: number;
    documentType: string;
    documentTypeId: number;
    documentNumber: string;
    level: string;
    levelId: number;
    city: string;
    phoneNumber?: string;
    username: string;
    photoUrl: string;
    age?: number;
    photos: Photo[];
}
