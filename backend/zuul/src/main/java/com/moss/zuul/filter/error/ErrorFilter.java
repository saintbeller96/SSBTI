package com.moss.zuul.filter.error;

import com.moss.zuul.filter.commons.ZuulFilterType;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;


@Component
public class ErrorFilter extends ZuulFilter {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public String filterType() {
        return ZuulFilterType.ERROR_TYPE;
    }

    @Override
    public int filterOrder() {
        return -1;
    }

    @Override
    public boolean shouldFilter() {
        return RequestContext.getCurrentContext().getThrowable() != null;
    }

    @Override
    public Object run() throws ZuulException {
        RequestContext context = RequestContext.getCurrentContext();
        Throwable t = context.getThrowable();
        logger.error("Exception was thrown: {}", t.getMessage());
        context.set("sendErrorFilter.ran");
        ZuulException e = (ZuulException)t;
        context.setResponseStatusCode(e.nStatusCode);
        return null;
    }
}
