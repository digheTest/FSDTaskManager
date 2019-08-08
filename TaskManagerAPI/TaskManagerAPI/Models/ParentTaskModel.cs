using System.Collections.Generic;


namespace TaskManagerAPI.Models
{
    public class ParentTaskModel
    {
        public int ParentTaskID { get; set; }

        public string ParentTaskName { get; set; }

        public IEnumerable<TaskModel> Task { get; set; }
    }
}