package hms.db;

import com.rethinkdb.RethinkDB;
import com.rethinkdb.net.Connection;
import com.rethinkdb.net.Result;
import org.json.JSONObject;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;


public class RethinkdbDriver {
    static String DB_PROPERTIES_FILE = "\\src\\main\\java\\hms\\db\\db.properties" ;
    static String DB_PROPERTIES_PATH = System.getProperty("user.dir") + DB_PROPERTIES_FILE;

    static RethinkDB r = RethinkDB.r;
    public static Connection conn = null;

    public static void initConnection() {
        String host;
        int port;

        try {
            FileInputStream fis = new FileInputStream(DB_PROPERTIES_PATH);
            Properties props = new Properties();
            props.load(fis);

            host = props.getProperty("HOST");
            port = Integer.parseInt(props.getProperty("PORT"));

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

//        System.out.println("host = " + host);
//        System.out.println("port = " + port);

        conn = r.connection().hostname(host).port(port).connect();
    }


}
