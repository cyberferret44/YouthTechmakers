const { getDatabase } = require('./mongo');

const { ObjectID } = require('mongodb');

const collectionName = 'students';

async function insertStudent(student) {
  const database = await getDatabase();
  const { insertedStudentId } = await database.collection(collectionName).insertOne(student);
  return insertedStudentId;
}

/*
// I do not believe this function is needed
async function getStudents() {
  const database = await getDatabase();
  return await database.collection(collectionName).find({}).toArray();
}
*/

async function deleteStudent(id) {
  const database = await getDatabase();
  await database.collection(collectionName).deleteOne({
    _id: new ObjectID(id),
  });
}

async function updateStudent(id, student) {
  const database = await getDatabase();
  delete student._id;
  await database.collection(collectionName).update(
    { _id: new ObjectID(id), },
    {
      $set: {
        ...student,
      },
    },
  );
}

module.exports = {
  insertStudent,
  //getStudents,
  deleteStudent,
  updateStudent,
};