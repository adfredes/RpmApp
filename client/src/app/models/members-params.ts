import { PaginationParams } from './paginationParams';
export class MembersParams extends PaginationParams{
    public gender: string;
    public level: string;
    public role: string;
    constructor({level, role, gender}: Partial<MembersParams>){        
        super();
        this.gender = gender;
        this.level = level;
        this.role = role;
    }
}