package com.example.demo.models.Set;

import com.example.demo.models.User;
import jakarta.persistence.*;
import lombok.Data;

@Data
@MappedSuperclass
public abstract class SetObject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Column(length = 255)
    protected String name;

    @Column(length = 255)
    protected String marking;

    @Column(name = "article_number", length = 255)
    protected String articleNumber;

    @Column(length = 255)
    protected String link;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    protected Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    protected User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    protected Brand brand;
}
