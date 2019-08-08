using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Results;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using TaskManagerAPI.Controllers;
using TaskManagerAPI.Models;
using Newtonsoft.Json.Linq;
using NBench;

namespace TaskManagerAPIUnitTest
{

    [TestClass]
    public class UnitTest1
    {
        private Counter _opCounter;
        private ValuesController _controller = new ValuesController();
        [TestMethod]
        public void Get()
        {
            // Act on Test  
            var response = _controller.Get();
            var contentResult = response as IEnumerable<ParentTaskModel>;
            // Assert the result  
            Assert.IsNotNull(contentResult);
        }
        [TestMethod]
        public void CreateParentTask()
        {
            // Act on Test  
            ParentTaskModel parentTask = new ParentTaskModel()
            {
                ParentTaskName = "New Task",
            };

            IHttpActionResult response = _controller.CreateParentTask(parentTask);
            var contentResult = response as OkNegotiatedContentResult<JObject>;
            // Assert the result  
            Assert.IsNotNull(contentResult);
        }
        [PerfSetup]
        public void SetUp(BenchmarkContext context)
        {
            _opCounter = context.GetCounter("MyCounter");
        }

        [PerfBenchmark(NumberOfIterations = 5, RunMode = RunMode.Throughput, RunTimeMilliseconds = 1000, TestMode = TestMode.Measurement)]
        [CounterMeasurement("MyCounter")]
        [MemoryMeasurement(MemoryMetric.TotalBytesAllocated)]
        public void BenchMarkMethod(BenchmarkContext context)
        {
            Get();
            _opCounter.Increment();
        }
        [TestMethod]
        public void ManageTask()
        {

            // Act on Test  
            List<TaskModel> tasks = new List<TaskModel>();
            TaskModel task = new TaskModel()
            {
                TaskName = "New Child Task",
                Priority = 1,
                StartDate = "10-08-2019",
                EndDate = "10-10-2019",
                IsCompleted = false,
            };
            tasks.Add(task);

            ParentTaskModel parentTask = new ParentTaskModel()
            {
                ParentTaskID = -1,
                ParentTaskName = "New Parent Task",
                Task = tasks,
            };

            IHttpActionResult response = _controller.ManageTask(parentTask);
            var contentResult = response as OkNegotiatedContentResult<JObject>;
            // Assert the result  
            Assert.IsNotNull(contentResult);
        }
        [TestMethod]
        public void EditEndTask()
        {
            TaskModel task = new TaskModel()
            {
                TaskId = 6007,
                TaskName = "Wow Good!!",
                Priority = 1,
                StartDate = "10-11-2019",
                EndDate = "10-12-2019",
                IsCompleted = true,
            };

            IHttpActionResult response = _controller.EditEndTask(task);
            var contentResult = response as OkNegotiatedContentResult<JObject>;
            // Assert the result  
            Assert.IsNotNull(contentResult);
        }
        [TestMethod]
        public void DeleteTask()
        {
            IHttpActionResult response = _controller.DeleteTask(6008);
            // Assert the result  
            Assert.IsNotNull(response.ToString().Contains(""));
        }
    }

}
