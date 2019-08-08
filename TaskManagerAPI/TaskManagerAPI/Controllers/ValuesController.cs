using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using TaskManagerReference;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Controllers
{
    [RoutePrefix("api/[controller]")]
    public class ValuesController : ApiController
    {
        ModelFactory _modelFactory;

        public ValuesController()
        {
            _modelFactory = new ModelFactory();
        }
        public ValuesController(ModelFactory modelFactory)
        {
            _modelFactory = modelFactory;
        }
        [HttpGet]
        public IEnumerable<ParentTaskModel> Get()
        {
            TaskManagerRepository parentTaskRep = new TaskManagerRepository();

            var allParentTask = parentTaskRep.GetAllParentTasksRepo().ToList();

            var allChildTask = parentTaskRep.GetAllTaskRepo().ToList();

            Parent_Task_Tbl newParent = new Parent_Task_Tbl
            {
                Task_Tbl = allChildTask,
            };

            allParentTask.Add(newParent);

            return allParentTask.Select(p => _modelFactory.GetParentTaskMoDel(p));
        }
       
        [HttpPost]
        public IHttpActionResult CreateParentTask([FromBody]ParentTaskModel parentTask)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Not a valid data");
            }
            try
            {
                TaskManagerRepository parentTaskRep = new TaskManagerRepository();

                Parent_Task_Tbl parentTaskDb = new Parent_Task_Tbl
                {
                    Parent_Task = parentTask.ParentTaskName,
                };

                string result = "{'ParentTaskID': " + parentTaskRep.CreateParentTask(parentTaskDb) + "}";

                JObject json = JObject.Parse(result);

                return Ok<JObject>(json);

            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred in CreateParentTask :" + ex.StackTrace);
            }

        }

        
        [HttpPost]
        public IHttpActionResult ManageTask([FromBody]ParentTaskModel parentTask)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid data");
            try
            {
                if (parentTask.ParentTaskID == 0)
                {
                    return TaskDBChanges(parentTask.Task.FirstOrDefault(), 0);
                }
                else if (parentTask.ParentTaskID == -1)
                {
                    CreateParentTask(parentTask);
                    return TaskDBChanges(parentTask.Task.FirstOrDefault());
                }
                else
                {
                    return TaskDBChanges(parentTask.Task.FirstOrDefault(), parentTask.ParentTaskID);
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred in CreateTask :" + ex.StackTrace);
            }

        }

        private IHttpActionResult TaskDBChanges(TaskModel taskModel, int parentID = 0)
        {
            TaskManagerRepository taskRep = new TaskManagerRepository();

            Task_Tbl taskDb = taskRep.GetTaskRepo(taskModel.TaskId);

            if (taskDb != null)
            {
                taskDb.Parent_ID = parentID > 0 ? parentID : (int?)null;
                taskDb.Task = taskModel.TaskName;
                taskDb.Start_Date = Convert.ToDateTime(taskModel.StartDate);
                taskDb.End_Date = Convert.ToDateTime(taskModel.EndDate);
                taskDb.Priority = taskModel.Priority;
                taskDb.Is_Completed = Convert.ToBoolean(taskModel.IsCompleted);
                string result = "{'TaskID': " + taskRep.EditTask(taskDb) + "}";
                JObject json = JObject.Parse(result);
                return Ok<JObject>(json);
            }
            else
            {
                Task_Tbl taskDbNew = new Task_Tbl
                {
                    Task = taskModel.TaskName,
                    Start_Date = Convert.ToDateTime(taskModel.StartDate),
                    End_Date = Convert.ToDateTime(taskModel.EndDate),
                    Priority = taskModel.Priority
                };
                string result = "{'TaskID': " + taskRep.CreateTask(taskDbNew) + "}";
                JObject json = JObject.Parse(result);
                return Ok<JObject>(json);
            }
        }

        [HttpDelete]
        public IHttpActionResult DeleteTask(int TaskID)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid data");
            try
            {
                TaskManagerRepository TaskRep = new TaskManagerRepository();

                if (TaskID > 0)
                {
                    TaskRep.DeleteTask(TaskID);
                    return Ok();
                }
                else
                {
                    return BadRequest("Error occurred during data deletion in DeleteTask");
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred in DeleteTask :" + ex.StackTrace);
            }
        }

        [HttpPut]
        public IHttpActionResult EditEndTask([FromBody]TaskModel taskModel)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid data");
            try
            {
                TaskManagerRepository taskRep = new TaskManagerRepository();

                Task_Tbl taskDb = taskRep.GetTaskRepo(taskModel.TaskId);

                if (taskDb != null)
                {
                    string result = "{'TaskID': " + taskRep.EditEndTask(taskModel.TaskId, taskModel.IsCompleted) + "}";
                    JObject json = JObject.Parse(result);
                    return Ok<JObject>(json);
                }
                else
                {
                    return BadRequest("Error occurred during data update in EditEndTask");
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred in EditEndTask :" + ex.StackTrace);
            }
        }

    }
}
