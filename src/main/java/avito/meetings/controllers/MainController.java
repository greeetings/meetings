package avito.meetings.controllers;

import avito.meetings.domain.Meeting;
import avito.meetings.repo.MeetingRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("meeting")
public class MainController {
    private final MeetingRepo meetingRepo ;

    @Autowired
    public MainController(MeetingRepo meetingRepo) {
        this.meetingRepo = meetingRepo;
    }

    @GetMapping
    public List<Meeting> list() {
        return meetingRepo.findAll();
    }

    @GetMapping("{id}")
    public Meeting getOne(@PathVariable Meeting meeting) {
        return meeting;
    }

    @PostMapping
    public Meeting create(@RequestBody Meeting meeting ) {

        return meetingRepo.save(meeting);
    }

    @PutMapping("{id}")
    public Meeting update(@PathVariable("id") Meeting meetingFromDb,
                          @RequestBody Meeting meeting) {

        if (meeting.getText() != null)
            BeanUtils.copyProperties(meeting, meetingFromDb,"id","participants","date");
        if (meeting.getDate() != null)
            BeanUtils.copyProperties(meeting, meetingFromDb,"id","participants","text");
        if (meeting.getParticipants() != null)
            BeanUtils.copyProperties(meeting, meetingFromDb,"id","text","date");


        return meetingRepo.save(meetingFromDb);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Meeting meeting) {

        meetingRepo.delete(meeting);
    }

}

























