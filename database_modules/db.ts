import mysql from 'mysql';

class DB {

    setConnection = () =>{
        let connection = mysql.createConnection({
            "host": "localhost",
            "user": "root",
            "password": "",
            "database": "booking",
            multipleStatements: true
        });

        return connection;
    }


}



export default DB;