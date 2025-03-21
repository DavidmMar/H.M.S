package hms;

import com.rethinkdb.RethinkDB;
import com.rethinkdb.net.Connection;
import com.rethinkdb.net.Result;


public class SolarCellRepository {
    RethinkDB r;
    Connection conn;

    public SolarCellRepository(RethinkDB r, Connection conn) {
        this.r = r;
        this.conn = conn;
    }

    final String DB = "solar_panel_1";

//    public static void storeMessage(String table, String msg) {
//        JSONObject json = new JSONObject();
//        json.put("msg", msg);
//
//        r.db(db).table(table).insert(json).run(conn);
//    }

    public static String listTables(RethinkDB r, Connection conn) {
        Result<Object> res = r.dbList().run(conn);

        return String.valueOf(res);
    }

    public static void listEntries(String table) {

    }

    public static void createTable(String table) {

    }
}
