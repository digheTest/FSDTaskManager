using System.Linq;
using TaskManagerReference;

namespace TaskManagerReference
{

    public class TaskManagerRepository
    {
        public IQueryable<Parent_Task_Tbl> GetAllParentTasksRepo()
        {
            TaskManagerDbEntities tmdb = new TaskManagerDbEntities();
            return tmdb.Parent_Task_Tbl;
        }
        public Parent_Task_Tbl GetParentTaskRepo(int ParentID)
        {
            TaskManagerDbEntities tmdb = new TaskManagerDbEntities();
            return tmdb.Parent_Task_Tbl.Where(p => p.Parent_ID == ParentID).Select(p => p).FirstOrDefault();
        }
        public IQueryable<Task_Tbl> GetAllTaskRepo()
        {
            TaskManagerDbEntities tmdb = new TaskManagerDbEntities();
            return tmdb.Task_Tbl.Where(t => t.Parent_ID == null || t.Parent_ID == 0);
        }
        public Task_Tbl GetTaskRepo(int TaskID)
        {
            TaskManagerDbEntities tmdb = new TaskManagerDbEntities();
            return tmdb.Task_Tbl.Where(p => p.Task_ID == TaskID).Select(p => p).FirstOrDefault();
        }
        public int CreateParentTask(Parent_Task_Tbl ParentTask)
        {
            TaskManagerDbEntities tmdb = new TaskManagerDbEntities();
            tmdb.Parent_Task_Tbl.Add(ParentTask);
            tmdb.SaveChanges();
            return ParentTask.Parent_ID;
        }
        //public int EditParentTask(int parentID, string parentName)
        //{
        //    TaskManagerDbEntities tmdb = new TaskManagerDbEntities();
        //    Parent_Task_Tbl ParentTaskDb = tmdb.Parent_Task_Tbl.Find(parentID);
        //    ParentTaskDb.Parent_Task = parentName;
        //    tmdb.SaveChanges();
        //    return parentID;
        //}
        public int CreateTask(Task_Tbl Task)
        {
            TaskManagerDbEntities tmdb = new TaskManagerDbEntities();
            tmdb.Task_Tbl.Add(Task);
            tmdb.SaveChanges();
            return Task.Task_ID;
        }
        public int EditTask(Task_Tbl Task)
        {
            TaskManagerDbEntities tmdb = new TaskManagerDbEntities();
            Task_Tbl TaskDb = tmdb.Task_Tbl.Find(Task.Task_ID);
            tmdb.Entry(TaskDb).CurrentValues.SetValues(Task);
            tmdb.SaveChanges();
            return Task.Task_ID;
        }
        public int DeleteTask(int TaskID)
        {
            TaskManagerDbEntities tmdb = new TaskManagerDbEntities();
            Task_Tbl taskTbl = tmdb.Task_Tbl.Where(t => t.Task_ID == TaskID).FirstOrDefault();
            tmdb.Task_Tbl.Remove(taskTbl);
            return tmdb.SaveChanges();
        }
        public int DeleteParentTask(int ParentTaskID)
        {
            TaskManagerDbEntities tmdb = new TaskManagerDbEntities();
            Parent_Task_Tbl parentTaskTbl = tmdb.Parent_Task_Tbl.Where(t => t.Parent_ID == ParentTaskID).FirstOrDefault();
            tmdb.Parent_Task_Tbl.Remove(parentTaskTbl);
            return tmdb.SaveChanges();
        }

        public int EditEndTask(int taskID, bool IsCompleted)
        {
            TaskManagerDbEntities tmdb = new TaskManagerDbEntities();
            Task_Tbl TaskDb = tmdb.Task_Tbl.Find(taskID);
            TaskDb.Is_Completed = IsCompleted;
            tmdb.SaveChanges();
            return taskID;
        }
    }
}

