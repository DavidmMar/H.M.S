package hms;

import org.springframework.web.bind.annotation.GetMapping;

public class SolarCellController {
    SolarCellService dbService;

    public SolarCellController(SolarCellService dbService) {
        this.dbService = dbService;
    }

    @GetMapping("hello")
    public String sayHello() {
        return "Hello Web";
    }


}
