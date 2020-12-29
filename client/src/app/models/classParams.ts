import { PaginationParams } from './paginationParams';
export class ClassParams extends PaginationParams{
    studentId?: number;

    constructor(public beginDate: Date = null,
                public endDate: Date = null,
                public levelId: number = 0,
                public teacherId: number = 0)
    {
        super();
        if (!this.beginDate)
        {
            this.beginDate = new Date();
            this.beginDate.setDate((new Date()).getDate() - 7);
        }

        if (!endDate)
        {
            this.endDate = new Date();
            this.endDate.setDate((new Date()).getDate() + 7);
        }

        if (this.levelId === 0){
            this.levelId = null;
        }

        if (this.teacherId === 0){
            this.teacherId = null;
        }
    }
}
