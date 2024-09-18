package hms;

import com.fasterxml.jackson.databind.util.JSONPObject;
import com.rethinkdb.RethinkDB;
import com.rethinkdb.net.Connection;
import com.rethinkdb.net.Result;
import org.json.JSONObject;

public class RethinkdbDriver {
    static RethinkDB r = RethinkDB.r;
    static Connection conn = null;

    public static void initConnection() {
        String host = "xxx";
        Integer port = 28015;

        conn = r.connection().hostname(host).port(port).connect();
    }

    static String db = "test";

    public static void storeMessage(String table, String msg) {
        JSONObject json = new JSONObject();
        json.put("msg", msg);

        r.db(db).table(table).insert(json).run(conn);
    }

    public static void createTable(String table) {

    }

    public static String listTables() {
        Result<Object> res = r.dbList().run(conn);

        return String.valueOf(res);
    }

    public static void listEntries(String table) {

    }
}
