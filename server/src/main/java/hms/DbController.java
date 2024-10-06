package hms;

import org.springframework.web.bind.annotation.GetMapping;

public class DbController {
    DbService dbService;

    public DbController(DbService dbService) {
        this.dbService = dbService;
    }

    @GetMapping("hello")
    public String sayHello() {
        return "Hello Web";
    }


}
