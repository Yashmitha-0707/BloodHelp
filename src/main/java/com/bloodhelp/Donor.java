package com.bloodhelp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int age;
    private String bloodGroup;
    private String phone;
    private String city;
private String registeredByUsername;

private boolean verified = false;
private boolean available = true;
    @ManyToOne
    @JoinColumn(name = "registered_by_id")
    private AppUser registeredBy;

    public Donor() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public AppUser getRegisteredBy() {
        return registeredBy;
    }

    public void setRegisteredBy(AppUser registeredBy) {
        this.registeredBy = registeredBy;
    }
    public boolean isVerified() {
    return verified;
}

public void setVerified(boolean verified) {
    this.verified = verified;
}

public boolean isAvailable() {
    return available;
}

public void setAvailable(boolean available) {
    this.available = available;
}
public String getRegisteredByUsername() {
    return registeredByUsername;
}

public void setRegisteredByUsername(String registeredByUsername) {
    this.registeredByUsername = registeredByUsername;
}
} 