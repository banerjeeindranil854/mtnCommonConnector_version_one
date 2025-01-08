package com.mtn.publicConnector.outbound.template;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public interface MappingTemplateControllerInterface<T> {

        @RequestMapping(
            method = {RequestMethod.POST},
            value = {"/"},
            produces = {"application/json"}
    )
    public  T getForObject(@RequestHeader(required = false, value = "test") String header,
                           @RequestParam(required = false) String url,
                           @RequestBody(required = false) T body);
    @RequestMapping(
            method = {RequestMethod.POST},
            value = {"/entity"},
            produces = {"application/json"}
    )
    public ResponseEntity<T> getForResponseEntity(@RequestParam String url);
}
