package avito.meetings.repo;

import avito.meetings.domain.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingRepo extends JpaRepository<Meeting, Long> {
}
