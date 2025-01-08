package com.mtn.rule.drools.config;


import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Objects;

@Component
public class MDCXRequestIdLoggingFilter implements Filter {
    /**
     * @param filterConfig
     * @throws ServletException
     */
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        Filter.super.init(filterConfig);
    }
    /**
     * @param servletRequest
     * @param servletResponse
     * @param filterChain
     * @throws IOException
     * @throws ServletException
     */
    @Override
    public void doFilter
    (ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {
        if (servletRequest instanceof HttpServletRequest httpServletRequest
                && servletResponse instanceof HttpServletResponse httpServletResponse) {

            var x_api_key = "";
            if (!Objects.isNull(httpServletRequest.getHeader("x_api_key")))
                x_api_key = httpServletRequest.getHeader("x_api_key");
            MDC.put("x_api_key", x_api_key);
            httpServletRequest.setAttribute("x_api_key", x_api_key);
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }
    /**
     *
     */
    @Override
    public void destroy() {
        Filter.super.destroy();
    }
}

