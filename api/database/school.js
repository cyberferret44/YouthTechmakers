const { getDatabase } = require('./mongo');

const { ObjectID } = require('mongodb');

const collectionName = 'schools';

async function insertSchool(school) {
  const database = await getDatabase();
  const { insertedSchoolId } = await database.collection(collectionName).insertOne(school);
  return insertedSchoolId;
}

async function getSchools() {
  const database = await getDatabase();
  return await database.collection(collectionName).find({}).toArray();
}

async function deleteSchool(id) {
  const database = await getDatabase();
  await database.collection(collectionName).deleteOne({
    _id: new ObjectID(id),
  });
}

async function updateSchool(id, school) {
  const database = await getDatabase();
  delete ad._id;
  await database.collection(collectionName).update(
    { _id: new ObjectID(id), },
    {
      $set: {
        ...school,
      },
    },
  );
}

module.exports = {
  insertSchools,
  getSchools,
  deleteSchools,
  updateSchools,
};