package hms;

import hms.db.RethinkdbDriver;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



@SpringBootApplication
@RestController
public class HmsApplication {
	public static void main(String[] args) {
		RethinkdbDriver.initConnection();

		MqttSubscriber.run();

		SpringApplication.run(HmsApplication.class, args);
	}

	@GetMapping("/")
	public String hello(@RequestParam(value="name", defaultValue="World") String name) {
		return String.format("Hello %s!", name);
	}

//	@GetMapping("/dblist")
//	public String dbList() {
//		return RethinkdbDriver.listTables();
//	}

}
