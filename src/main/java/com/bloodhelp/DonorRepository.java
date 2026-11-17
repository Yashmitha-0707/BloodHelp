package com.bloodhelp;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonorRepository extends JpaRepository<Donor, Long> {

    List<Donor> findByBloodGroup(String bloodGroup);

    List<Donor> findByBloodGroupAndCityIgnoreCase(
            String bloodGroup, String city);

    List<Donor> findByRegisteredBy_Username(String username);
List<Donor> findByBloodGroupIgnoreCaseAndCityIgnoreCaseAndVerifiedTrueAndAvailableTrue(
        String bloodGroup, String city);
}

