export class ClassEdit
    {   
        static getNew(id: number, { dateOfClass, duration, levelId, capacity, teacherId}){
            return new ClassEdit(id, dateOfClass, parseInt(duration),parseInt(levelId), parseInt(capacity), parseInt(teacherId));
        }        
        
        constructor(
            public Id: number, 
            public DateOfClass: Date,
            public Duration: number,
            public LevelId: number,
            public Capacity: number,
            public TeacherId: number            
        ){}
    }