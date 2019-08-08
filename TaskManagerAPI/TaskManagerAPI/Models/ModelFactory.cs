using System;
using System.Linq;
using TaskManagerReference;

namespace TaskManagerAPI.Models
{
    public class ModelFactory
    {
        public ParentTaskModel GetParentTaskMoDel(Parent_Task_Tbl parentTaskTbl)
        {
            ParentTaskModel ptm = new ParentTaskModel();
            ptm.ParentTaskID = parentTaskTbl.Parent_ID;
            ptm.ParentTaskName = parentTaskTbl.Parent_Task;
            ptm.Task = parentTaskTbl.Task_Tbl.Select(t => GetTaskModel(t));



            return new ParentTaskModel()
            {
                ParentTaskID = parentTaskTbl.Parent_ID,
                ParentTaskName = parentTaskTbl.Parent_Task,
                Task = parentTaskTbl.Task_Tbl.Select(t => GetTaskModel(t))
            };
        }

        public TaskModel GetTaskModel(Task_Tbl task)
        {
            return new TaskModel()
            {
                TaskId = task.Task_ID,
                TaskName = task.Task,
                StartDate = Convert.ToString(task.Start_Date),
                EndDate = Convert.ToString(task.End_Date),
                Priority = Convert.ToInt32(task.Priority),
                IsCompleted = Convert.ToBoolean(task.Is_Completed)
            };
        }
    }
}