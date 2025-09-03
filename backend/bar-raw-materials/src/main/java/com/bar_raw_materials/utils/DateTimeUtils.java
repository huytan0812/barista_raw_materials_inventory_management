package com.bar_raw_materials.utils;

import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.HashMap;
import java.util.Collections;

import java.time.LocalDate;

@Component
public class DateTimeUtils {
    public int getQuarter(LocalDate day) {
        int quarter = 0;
        int month = day.getMonthValue();
        if (month >= 10) quarter = 4;
        else if (month >= 7) quarter = 3;
        else if (month >= 4) quarter = 2;
        else quarter = 1;
        return quarter;
    }

    public LocalDate getStart(int quarter, int year) {
        if (quarter == 4) return LocalDate.of(year, 10, 1);
        else if (quarter == 3) return LocalDate.of(year, 7, 1);
        else if (quarter == 2) return LocalDate.of(year, 4, 1);
        else return LocalDate.of(year, 1, 1);
    }

    public LocalDate getEnd(int quarter, int year) {
        if (quarter == 4) return LocalDate.of(year, 12, 31);
        else if (quarter == 3) return LocalDate.of(year, 9, 30);
        else if (quarter == 2) return LocalDate.of(year, 6, 30);
        else return LocalDate.of(year, 3, 31);
    }
}
